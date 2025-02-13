# FAQ

此处列出一些您在使用 RockOS 时可能遇到的问题与对应的解决方案。

## 我的 AMD RDNA（或更新）显卡不工作，开机时会出现 Kernel Oops

此问题与 AMD 显卡的 PCI-E D3cold 相关。

解决方案：编辑 `/etc/default/u-boot`，在 `U_BOOT_PARAMETERS` 部分添加如下内容：

`pcie_port_pm=off pcie_aspm.policy=performance`

您可使用 `nano` 编辑：`sudo nano /etc/default/u-boot`

编辑完成后，按 `Ctrl+X` 按提示保存，然后运行 `sudo u-boot-update`，重启系统。

## 我需要 Imagination GPU 上的 OpenGL 支持

可通过 `Zink` 来使用 `OpenGL`。

执行如下命令，可全局启用 `Zink` 支持：

```shell
sudo cp -vrf /usr/share/xorg/glx/extensions/ /usr/lib/xorg/modules/
sudo sh -c 'echo MESA_LOADER_DRIVER_OVERRIDE=zink > /etc/environment'
sudo systemctl restart lightdm.service
```