# FAQ

此处列出一些您在使用 RockOS 时可能遇到的问题与对应的解决方案。

## 独立显卡相关

### 我希望禁用集成 Imagination GPU 及板载 HDMI 输出（即切换至仅使用独立显卡）

安装独立显卡后，默认仍仅从板载 HDMI 接口输出。

需要进行以下操作，禁用核心显卡和显示输出，并切换 `Mesa` 版本。

编辑 `/etc/default/u-boot`，在 `U_BOOT_PARAMETERS` 部分添加如下内容：

`initcall_blacklist=es_drm_init module_blacklist=pvrsrvkm`

您可使用 `nano` 编辑：`sudo nano /etc/default/u-boot`

编辑完成后，按 `Ctrl+X` 按提示保存，然后运行 `sudo u-boot-update`。

除此之外，默认的 `Mesa` 版本是专为 Imagination GPU 适配的，使用 AMD GPU 需要切换 Mesa 版本并开启 GLX 扩展：

```shell
dpkg -l | grep 22.3.5+1rockos1+0pvr2 | awk '{print $2"=24.2.3-1"}' | xargs sudo apt install --allow-downgrades -y
sudo apt-mark hold libegl-mesa0 libgbm1 libgl1-mesa-dri libglapi-mesa libglx-mesa0 \
mesa-va-drivers mesa-vdpau-drivers mesa-vulkan-drivers mesa-libgallium
sudo cp -vrf /usr/share/xorg/glx/extensions/ /usr/lib/xorg/modules/
```

此外，`/etc/vulkan/icd.d` 默认配置成使用 IMG 显卡，需要先移除相关配置。

其中 `/etc/vulkan/icd.d/powervr_icd.json` 这一配置文件随 `eswin-eic7x-gpu` 包附带，你可以 *purge* 此软件包来移除配置文件：

```shell
sudo apt purge -y eswin-eic7x-gpu
```

重启开发板。独立显卡此时应当能够正确输出画面了。

#### 恢复使用 IMG GPU

恢复先前修改即可。

```shell
# 移除先前添加的 PCI-E 和 blacklist 参数
# pcie_port_pm=off initcall_blacklist=es_drm_init module_blacklist=pvrsrvkm
sudo nano /etc/default/u-boot
sudo u-boot-update
# 切换 Mesa 版本
sudo apt-mark unhold libegl-mesa0 libgbm1 libgl1-mesa-dri libglapi-mesa libglx-mesa0 \
mesa-va-drivers mesa-vdpau-drivers mesa-vulkan-drivers mesa-libgallium
sudo apt update; sudo apt upgrade -y
sudo apt upgrade -y libegl-mesa0 libgbm1 libgl1-mesa-dri libglapi-mesa libglx-mesa0
# 移除 GLX 扩展
sudo rm -vrf /usr/lib/xorg/modules/extensions
# 恢复 GPU 软件包及其配置
sudo apt install -y eswin-eic7x-gpu
```

### 我的 AMD RDNA（或更新）显卡不工作，开机时会出现 Kernel Oops

此问题与 AMD 显卡的 PCI-E D3cold 相关。

解决方案：编辑 `/etc/default/u-boot`，在 `U_BOOT_PARAMETERS` 部分添加如下内容：

`pcie_port_pm=off`

您可使用 `nano` 编辑：`sudo nano /etc/default/u-boot`

编辑完成后，按 `Ctrl+X` 按提示保存，然后运行 `sudo u-boot-update`。

如果此时已经安装了显卡，可能会出现无法重启的情况，可以使用 `SysRq` 的方式强制重启：

```shell
sync
sudo sh -c 'echo 1 > /proc/sys/kernel/sysrq'
sudo sh -c 'echo b > /proc/sysrq-trigger'
```

### 安装独立显卡后，开机时死机

很可能您遇到了供电不足。请使用 ATX 而非 DC 电源。

根据 PCI-E 规范，PCI-E 插槽供电需要 75W 供电能力，如果使用 12V 5A 的 60W DC 供电则可能会供电不足，进而无法正常开机。

## 我需要 Imagination GPU 上的 OpenGL 支持

可通过 `Zink` 来使用 `OpenGL`。

执行如下命令，可**全局**启用 `Zink` 支持：

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

### 为 `mmz` 保留更多内存

某些特定场景下，您可能想为 `mmz` 预留更多内存，例如：在 NPU 上运行 LLM 时需要大量内存。

这种情况下，将上述命令中的 `0x1000` （十六进制，单位为 Byte）替换成所需内存大小即可。

例如，在 32G 版本的开发板上预留 20G 内存：

```
=> env set -f bootcmd 'fdt mmz mmz_nid_0_part_0 0x300000000 0x500000000;bootflow scan -lb'; env save
Saving Environment to SPIFlash... Erasing SPI flash...Writing to SPI flash...done
OK
=> boot
Added mmz_nid_0_part_0 to reserved-memory node, addr=0x300000000, size=0x500000000
Scanning for bootflows in all bootdevs
...(正常启动流程)...
```

## 运行 apt update 时，提示 GPG 签名过期

此问题在 20250330_20250423 release 后已经修复，请及时更新您的系统。

如果是在更老版本的系统，可通过手动安装新 `rockos-keyring` 包的方法更新 keyring：

```shell
wget https://fast-mirror.isrc.ac.cn/rockos/20250330/rockos-addons/pool/main/r/rockos-keyring/rockos-keyring_2025.03.28_all.deb
sudo dpkg -i rockos-keyring_2025.03.28_all.deb
rm rockos-keyring_2025.03.28_all.deb
```

## 音频异常 / 破音

> 下一版本的 RockOS 将集成此修复。

请执行如下命令：

```shell
sudo sh -c 'cat << EOF >> /etc/pulse/daemon.conf
default-fragments = 4
default-fragment-size-msec = 10
EOF'
systemctl restart --user pulseaudio.service
```