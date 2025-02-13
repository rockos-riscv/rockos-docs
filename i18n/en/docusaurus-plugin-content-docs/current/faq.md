# FAQ

Some common Q&As for RockOS.

## My AMD RDNA (or newer) GPU isn't working, with Kernel Oops on boot

This is related to AMD GPUs' PCI-E D3cold.

To solve this, edit `/etc/default/u-boot`, add the following parameters in `U_BOOT_PARAMETERS` section:

`pcie_port_pm=off pcie_aspm.policy=performance`

You can use `nano` to edit: `sudo nano /etc/default/u-boot`

After editing, press `Ctrl+X` and follow the prompts to save, then run `sudo u-boot-update` and reboot the system.

## I need OpenGL on the intergated Imagination GPU

You can use `Zink` for `OpenGL`.

Run the following command to enable `Zink` globally:

```shell
sudo cp -vrf /usr/share/xorg/glx/extensions/ /usr/lib/xorg/modules/
sudo sh -c 'echo MESA_LOADER_DRIVER_OVERRIDE=zink > /etc/environment'
sudo systemctl restart lightdm.service
```