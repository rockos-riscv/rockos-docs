# 镜像刷写教程

## Milk-V Megrez

### 准备工作

- Milk-V Megrez 开发板本体
- USB A to C / USB C to C 线缆
- DC 12V 或 ATX 电源
- eMMC 模块/M.2 SATA SSD / PCI-E SSD（M.2 NVMe SSD 需要转接卡）/ microSD 存储卡
    - 任选一种存储设备即可，但不可同时插入多个烧录了系统的存储介质
- （可选）键盘、鼠标、显示器、网线
- （可选）M.2 SDIO Wi-Fi 模块
- （可选）以 FAT32 或 EXT4 格式化的 U 盘一个，用于升级 bootloader 固件
    - 如果使用 `dhcp` 或 `tftpboot`，则需要以太网连接，且计算机上已安装并配置好 TFTP 服务器
- （可选）M.2 SATA / PCI-E 转 USB 硬盘盒
    - 用于刷写镜像至 SSD
- （可选）microSD 读卡器
    - 用于烧写镜像至 microSD 卡

### 镜像下载

请从 [此处](https://mirror.iscas.ac.cn/rockos/images/generic/latest/) 下载 bootloader, boot 和 root 镜像。

- BootFS: `boot-rockos-*.ext4.zst`
- RootFS: `root-rockos-*.ext4.zst`
- microSD 卡和 SSD：`sdcard-rockos-*.img.zst`
- Bootloader: `bootloader_secboot_ddr5_milkv-megrez.bin`

bootfs 及 rootfs 请下载后进行解压。

如果您想通过 U 盘更新 bootchain 固件，则请将 `bootloader_secboot_ddr5_milkv-megrez.bin` 复制到 U 盘的第一个 FAT32 或 EXT4 分区。您可将其重命名成较短的文件名，以便稍后操作。

Linux 环境下，请安装 `zstd` 后进行解压。

Windows 下，可使用 7-zip / Nanazip 等软件解压。

### 刷写镜像

#### 更新 bootchain 固件（推荐）

首先我们应该更新固件，即 EIC7700X 开发板上的 bootchain 固件。

简单来说，您需要将固件加载进内存，然后运行 `es_burn` 来将固件烧录至板载 SPI Flash 中。

有如下几种方式加载 bootchain 文件：

- 从内部或外部存储设备
    - `ext4load`
    - `fatload`
- 通过网络/局域网
    - `tftpboot`
    - `dhcp`

1. 将开发板 Type-C debug 接口连接至计算机。

你将看到一个 `CH340` USB 转 UART 设备出现。

2. 打开串口控制台。

在 Linux 上，可以使用 `tio` `minicom` 等工具。

在 Windows 上可以使用 `PuTTY` `SimplySerial` 等工具。

开发板默认波特率为 115200。

3. 现在接入电源，Megrez 应当会自动上电开机。

确保引导设备在上电前已正确安装。

如果您想从 U 盘更新 bootchain，请在上电前就将其插入。务必插到靠近 3.5mm 一侧的两个 USB 口中，否则可能会无法识别。

4. 控制台提示 `Autoboot in 5 seconds` 时，按 `s` 打断自动启动。

##### 通过 U 盘更新

1. 检查 U 盘是否已被识别：`usb info`

如果您是在上电之后才插入的，需要运行 `usb reset` 来重新扫描 USB 设备。

2.1. 如果是 FAT32 格式：`fatload usb 0 0x90000000 bootloader_secboot_ddr5_milkv-megrez.bin`

2.2 如果是 EXT4 格式：`ext4load usb 0 0x9000000 0bootloader_secboot_ddr5_milkv-megrez.bin`

3. 刷写固件并重启：`es_burn write 0x90000000 flash; reset`

4. 重启后，建议重置 U-Boot 环境变量至默认值并保存：

```shell
env default -a -f; env save; reset
```

否则可能会出现每次重启时 MAC 地址都会重新生成的问题。

##### 通过 TFTP 更新

设置一个 TFTP 服务器。

对于 Windows 用户，可使用 [TFTPd64](https://pjo2.github.io/tftpd64/)；对于 Linux 用户，可使用 `tftp-hpa` 或 `atftp`，除此以外 `dnsmasq` 也有一个内置的 TFTP 服务器可用。

可以参考 [Arch Wiki](https://wiki.archlinux.org/title/TFTP#Server) 提供的相关文档。

确保 TFTP 服务器在根目录提供了 `bootloader_secboot_ddr5_milkv-megrez.bin` 文件。

检查您计算机的 LAN IP 地址。

确保开发板连接到了以太网。

打断自动启动后，运行：

```shell
dhcp 0x90000000 $hostIPaddr:bootloader_secboot_ddr5_milkv-megrez.bin
es_burn write 0x90000000 flash; reset
```

和上面通过 U 盘更新相同，建议重置 U-Boot 环境变量至默认值并保存：

```shell
env default -a -f; env save; reset
```

否则可能会出现每次重启时 MAC 地址都会重新生成的问题。

#### 通过 `fastboot` 烧录镜像至 eMMC

更新好 bootchain 后，给开发板上电，按 `s` 打断启动，然后执行如下步骤：

1. 在 U-Boot 控制台：`fastboot usb 0`

2. 找到 DC 电源接口附近的 `RECOVERY` 开关，将其切换到 `RECOVERY` 模式。您的计算机应该会识别到一个`USB download gadget` 或 `Android Bootloader Interface` 设备。

3. 使用 `fastboot` 刷写固件。

（在 Linux 上你将需要 `sudo`，或者将 VID:PID 3452:7700 添加进你的 udev 规则。）

```shell
fastboot flash boot boot-rockos-20250423-145338.ext4
fastboot flash root root-rockos-20250423-145338.ext4
```

4. 等待刷写过程结束。结束后，在 U-Boot 控制台按 Ctrl+C，然后输入 `reset` 重启。

5. 至此，一切就绪。

> [!NOTE]
> 虽然 U-Boot 也支持通过 `fastboot udp` 从网络刷写，但速度相对要慢很多。
> 通常不推荐从网络刷写，除非您完全远程操作，无法拨动板子上的开关。

#### 烧录至 SSD 或 microSD

使用 `etcher` 或 `dd` 来将 sdcard 镜像写入 SSD 或 microSD 即可。

对于 Windows 用户，也可使用 Rufus。

:::tip
从 microSD/SSD 启动如果遇到问题，可尝试更新位于板载 SPI Flash 上的 bootloader。
:::

```shell
sudo dd if=sdcard-rockos-20250423-145338.img of=/dev/sdX bs=1M status=progress; sync
```

### 其它说明

开机进入系统后，推荐进行一次系统更新。

```shell
sudo apt update; sudo apt upgrade -y; sudo reboot
```

默认用户名和密码均为：`debian`

## SiFive HiFive Premier P550

### 准备工作

- HiFive Premier P550 开发板本体
- DC 12V 或 ATX 电源
- SATA SSD / PCI-E SSD（M.2 NVMe SSD 需要转接卡）/ microSD 卡
    - 任选一种存储设备即可，但不可同时插入多个烧录了系统的存储介质
- （可选）键盘、鼠标、显示器、网线
- （可选）M.2 SDIO Wi-Fi 模块
- （可选）以 FAT32 或 EXT4 格式化的 U 盘一个，用于升级 bootloader 固件
    - 如果使用 `dhcp` 或 `tftpboot`，则需要以太网连接，且计算机上已安装并配置好 TFTP 服务器
- （可选）M.2 SATA / PCI-E 转 USB 硬盘盒
    - 用于刷写镜像至 SSD
- （可选）microSD 读卡器
    - 用于烧写镜像至 microSD 卡
- USB Type A 转 USB Type C 线缆
- USB Type A 转 USB Type A 线缆

### 更新 bootloader

首先通过串口连接到开发板，在线缆正确接入开发板后，会列举为四个 UART。

<!-- ![tty](./image%20for%20flash/tty.png) -->

根据[MCU 用户手册](https://www.sifive.com/api/document-file?uid=premier-p550-mcu-user-manual)中 2.1.1.1 节的内容，我们在 minicom 中将 ttyUSB2 设置为连接路径，波特率设置为 115200。

:::tip
下表仅针对 SiFive HiFive Premier P550 开发板，其它开发板可能不同。
:::

<!-- ![uart](./image%20for%20flash/uart.png) -->
| 序号 | 设备 |
| :-: | :-: |
| 00 | SOC JTAG (eic7700x mcpu) |
| 01 | MCU JTAG (stm32) |
| 02 | SOC UART (eic7700x uart0) |
| 03 | MCU UART (stm32 uart3) |

```bash
sudo minicom -D /dev/ttyUSB2 -b 115200
```

插入准备好的含有 bootloader 文件的 U 盘。

按下电源键启动后，观察 minicom 窗口内，按任意键打断 U-Boot 加载。

<!-- ![interrupt](./image%20for%20flash/Interrupt.png) -->

执行下面的命令，查看 U 盘内的文件。

```bash
usb start

fatls usb 0 / # 如U盘内存在多个文件时请确认bootloader文件的存放路径
```

<!-- ![usb](./image%20for%20flash/check-usb.png) -->

确认 U 盘内文件正确后执行下面命令

```bash
fatload usb 0 0x90000000 bootloader_secboot_ddr5_hifive-p550.bin

es_burn write 0x90000000 flash
```

重启后再次打断机器执行分区（第一次刷写必选，需要给分区足够大小容纳刷写 boot/root）

```bash
reset 
# 打断uboot启动
run gpt_partition 
```

<!-- ![partition](./image%20for%20flash/gpt_partition.png) -->

### 烧录至 eMMC

请用 USB Type A 转 USB Type C 以及 USB Type A 转 USB Type A 将开发板与主机相连。

根据[官方手册](https://sifive.cdn.prismic.io/sifive/ZxLYXYF3NbkBXux1_HF106_user_guide_V1p0_zh_Final.pdf)中 3.1.6 部分的内容

USB Type A 转 USB Type A 将接入编号 10 双 USB Type-A 连接器中靠上的接口。

USB Type A 转 USB Type C 接入编号 15 `Type-C USB` 连接器。

#### Boot&Rootfs

在启动并打断机器后输入以下命令进入 fastboot 状态 (需要提前拔掉 USB Type A 转 USB Type A 线缆，避免电路冲突或者通信冲突)

```bash
fastboot usb 0
```

<!-- ![fastboot](./image%20for%20flash/fastboot0.png) -->

在主机上另开一个终端，执行刷写命令

```bash
sudo fastboot flash boot boot-eswin_evb-20241024-145708.ext4 # 刷写boot
sudo fastboot flash root root-eswin_evb-20241024-145708.ext4 # 刷写rootfs
# 请注意文件路径 刷写时间大约在10分钟左右
```

返回 minicom 端口后按任意键取消 fastboot 状态，随后执行 reset 重启机器。

至此 RockOS 镜像刷写完成。

<!-- ![neofetch](./image%20for%20flash/neofetch.png) -->