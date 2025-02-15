# FAQ

Some common Q&As for RockOS.

## dGPU related

### My AMD RDNA (or newer) GPU isn't working, with Kernel Oops on boot

This is related to AMD GPUs' PCI-E D3cold.

To solve this, edit `/etc/default/u-boot`, add the following parameters in `U_BOOT_PARAMETERS` section:

`pcie_port_pm=off pcie_aspm.policy=performance`

You can use `nano` to edit: `sudo nano /etc/default/u-boot`

After editing, press `Ctrl+X` and follow the prompts to save, then run `sudo u-boot-update`.

If you already installed the dGPU, you might not be able to perform a system reboot. You can use `SysRq` to do a force reboot:

```shell
sudo sh -c 'echo 1 > /proc/sys/kernel/sysrq'
sudo sh -c 'echo b > /proc/sysrq-trigger'
```

### I installed a dGPU but the system freezes on boot

It's very likely that you have insufficient power supply. Please use ATX PSU rather than DC PSU.

According to PCI-E specifications, PCI-E slot requires 75W of power, while using a 12V 5A 60W DC PSU might not be enough, thus causing a boot failure.

### No video output on dGPU

This is because the system is configured to use the Imagination GPU and onboard HDMI output by default.

We need to change the configurations, disable the iGPU and display output, and switch `Mesa` version.

Like the D3cold workaround above, we can edit `/etc/default/u-boot`, add the following parameters in `U_BOOT_PARAMETERS` section:

`initcall_blacklist=es_drm_init module_blacklist=pvrsrvkm`

You can use `nano` to edit: `sudo nano /etc/default/u-boot`

After editing, press `Ctrl+X` and follow the prompts to save, then run `sudo u-boot-update`.

The default installed `Mesa` is specifically for Imagination GPU rather than AMD GPUs, so we'll need to switch versions here:

```shell
dpkg -l | grep 22.3.5+1rockos1+0pvr2 | awk '{print $2"=24.2.3-1"}' | xargs sudo apt install --allow-downgrades -y
sudo apt-mark hold libegl-mesa0 libgbm1 libgl1-mesa-dri libglapi-mesa libglx-mesa0 \
mesa-va-drivers mesa-vdpau-drivers mesa-vulkan-drivers mesa-libgallium
sudo cp -vrf /usr/share/xorg/glx/extensions/ /usr/lib/xorg/modules/
```

Now you can reboot the board. Video output should be on the dGPU now.

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