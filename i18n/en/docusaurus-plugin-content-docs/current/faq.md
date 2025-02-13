# FAQ

Some common Q&As for RockOS.

## My AMD RDNA (or newer) GPU isn't working, with Kernel Oops on boot

This is related to AMD GPUs' PCI-E D3cold.

To solve this, edit `/etc/default/u-boot`, add the following parameters in `U_BOOT_PARAMETERS` section:

`pcie_port_pm=off pcie_aspm.policy=performance`

You can use `nano` to edit: `sudo nano /etc/default/u-boot`

After editing, press `Ctrl+X` and follow the prompts to save, then run `sudo u-boot-update` and reboot the system.

## I need OpenGL on the integrated Imagination GPU

You can use `Zink` for `OpenGL`.

Run the following commands to enable `Zink` globally:

```shell
sudo cp -vrf /usr/share/xorg/glx/extensions/ /usr/lib/xorg/modules/
sudo sh -c 'echo MESA_LOADER_DRIVER_OVERRIDE=zink > /etc/environment'
sudo systemctl restart lightdm.service
```

## Available RAM less than expected

You may see less RAM available, e.g. ~9.7GB for 16GB boards, or ~25GB for 32GB boards.

This is due to, part of the RAM is allocated for NPU, video encoder/decoder, etc.

To free up this part of memory, you can change the boot command in U-Boot environment.

:::warning
NPU, video codec, and other related functions will no longer work after releasing `mmz` memory.

Do not proceed if you still need these features.
:::

Connect UART serial to your PC. Use tools like `minicom`, `tio`, `PuTTY` to connect.

When prompting `Autoboot in 5 seconds`, press `s` to interrupt.

Check the the current `bootcmd`, just in case: 

```
Autoboot in 5 seconds
=> env print bootcmd
bootcmd=bootflow scan -lb
```

Change `bootcmd` to: `fdt mmz mmz_nid_0_part_0 0x300000000 0x1000;bootflow scan -lb`

```
=> env set -f bootcmd 'fdt mmz mmz_nid_0_part_0 0x300000000 0x1000;bootflow scan -lb'; env save
Saving Environment to SPIFlash... Erasing SPI flash...Writing to SPI flash...done
OK
=> boot
Added mmz_nid_0_part_0 to reserved-memory node, addr=0x300000000, size=0x1000
Scanning for bootflows in all bootdevs
...(Normal boot process)...
```

Login and check available system RAM:

```shell
debian@rockos-eswin:~$ free -hm
               total        used        free      shared  buff/cache   available
Mem:            31Gi       558Mi        30Gi       4.4Mi       286Mi        30Gi
Swap:             0B          0B          0B
```

To revert, set `bootcmd` back to `bootflow scan -lb`, then `env save`.