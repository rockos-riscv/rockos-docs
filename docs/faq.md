# FAQ

此处列出一些您在使用 RockOS 时可能遇到的问题与对应的解决方案。

## 独立显卡相关

### 我的 AMD RDNA（或更新）显卡不工作，开机时会出现 Kernel Oops

此问题与 AMD 显卡的 PCI-E D3cold 相关。

解决方案：编辑 `/etc/default/u-boot`，在 `U_BOOT_PARAMETERS` 部分添加如下内容：

`pcie_port_pm=off pcie_aspm.policy=performance`

您可使用 `nano` 编辑：`sudo nano /etc/default/u-boot`

编辑完成后，按 `Ctrl+X` 按提示保存，然后运行 `sudo u-boot-update`，重启系统。

### 我安装了一张独立显卡，但是开机时死机

很可能您遇到了供电不足。请使用 ATX 而非 DC 电源。

根据 PCI-E 规范，PCI-E 插槽供电需要 75W 供电能力，如果使用 12V 5A 的 60W DC 供电则可能会供电不足，进而无法正常开机。

### 独立显卡无显示输出

这是由于系统默认使用了 Imagination GPU 以及板载的 HDMI 接口输出。

我们需要修改配置，禁用核心显卡和显示输出，并切换 `Mesa` 版本。

与上述 D3cold 问题的方法类似，我们可以编辑 `/etc/default/u-boot`，在 `U_BOOT_PARAMETERS` 部分添加如下内容：

`initcall_blacklist=es_drm_init module_blacklist=pvrsrvkm`

您可使用 `nano` 编辑：`sudo nano /etc/default/u-boot`

编辑完成后，按 `Ctrl+X` 按提示保存，然后运行 `sudo u-boot-update`。

除此之外，默认的 `Mesa` 版本是专为 Imagination GPU 适配的，使用 AMD GPU 需要切换版本：

```shell
dpkg -l | grep 22.3.5+1rockos1+0pvr2 | awk '{print $2"=24.2.3-1"}' | xargs sudo apt install --allow-downgrades -y
sudo apt-mark hold libegl-mesa0 libgbm1 libgl1-mesa-dri libglapi-mesa libglx-mesa0 \
mesa-va-drivers mesa-vdpau-drivers mesa-vulkan-drivers mesa-libgallium
```

重启开发板，独立显卡此时应当能够正确输出画面了。

## 我需要 Imagination GPU 上的 OpenGL 支持

可通过 `Zink` 来使用 `OpenGL`。

执行如下命令，可全局启用 `Zink` 支持：

```shell
sudo cp -vrf /usr/share/xorg/glx/extensions/ /usr/lib/xorg/modules/
sudo sh -c 'echo MESA_LOADER_DRIVER_OVERRIDE=zink > /etc/environment'
sudo systemctl restart lightdm.service
```

## 可用运行内存少于预期值

您可能会发现实际可用内存少于预期，如 16GB 版本实际可用约 9.7GB，32GB 版本实际可用约 25GB。

这是由于部分内存已分配给 NPU 和视频编解码器等功能。

如需释放这部分运行内存，您可以更改 U-Boot 环境变量中的启动命令。

:::warning
释放 `mmz` 内存后，NPU、视频编解码和其他相关功能将无法工作。

若仍需要这些功能，请勿释放这部分内存。
:::

将 UART 串口连接到计算机。可使用 `minicom`, `tio`, `PuTTY` 等工具。

提示 `Autoboot in 5 seconds`, 按 `s` 中断自动启动。

检查当前的 `bootcmd` 以防万一：

```
Autoboot in 5 seconds
=> env print bootcmd
bootcmd=bootflow scan -lb
```

将 `bootcmd` 更改为：`fdt mmz mmz_nid_0_part_0 0x300000000 0x1000;bootflow scan -lb`

```
=> env set -f bootcmd 'fdt mmz mmz_nid_0_part_0 0x300000000 0x1000;bootflow scan -lb'; env save
Saving Environment to SPIFlash... Erasing SPI flash...Writing to SPI flash...done
OK
=> boot
Added mmz_nid_0_part_0 to reserved-memory node, addr=0x300000000, size=0x1000
Scanning for bootflows in all bootdevs
...(正常启动流程)...
```

登录系统后检查可用内存：

```shell
debian@rockos-eswin:~$ free -hm
               total        used        free      shared  buff/cache   available
Mem:            31Gi       558Mi        30Gi       4.4Mi       286Mi        30Gi
Swap:             0B          0B          0B
```

如需恢复，将 `bootcmd` 还原回 `bootflow scan -lb`，然后 `env save` 即可。