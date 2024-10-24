## 演示环境

主机系统版本:Ubuntu22.04 

minicom版本:2.8

fastboot版本：28.0.2-debian

## 准备工作

### 硬件准备

- USB Type A 转 USB Type C 线缆
- USB Type A 转 USB Type A 线缆
- 一个格式化为FAT32的U盘

### 镜像下载

- bootloader：[点击下载](https://mirror.iscas.ac.cn/rockos/extra/images/evb1/0930/20241015/bootloader_secboot_ddr5_hifive-p550.bin)

- boot：[点击下载](https://mirror.iscas.ac.cn/rockos/extra/images/evb1/0930/20241015/boot-eswin_evb-20241015-120631.ext4.zst)

- rootfs：[点击下载](https://mirror.iscas.ac.cn/rockos/extra/images/evb1/0930/20241015/root-eswin_evb-20241015-120631.ext4.zst)

boot及rootfs请下载后进行解压，bootloader文件下载完成后请拷贝到已经格式化为FAT32的U盘中。

## 镜像刷写

请用USB Type A 转 USB Type C以及USB Type A 转 USB Type A将开发板与主机相连。

根据[官方手册](https://sifive.cdn.prismic.io/sifive/ZxLYXYF3NbkBXux1_HF106_user_guide_V1p0_zh_Final.pdf)中3.1.6部分的内容

USB Type A 转 USB Type A将接入编号10双 USB Type-A连接器中靠上的接口。

USB Type A 转 USB Type C接入编号15Type-C USB连接器。

### bootloader

首先通过串口连接到开发板，在线缆正确接入开发板后，会列举为四个 UART。

![](./image%20for%20flash/tty.png)

根据[MCU用户手册](https://www.sifive.cn/api/document-file?uid=premier-p550-mcu-user-manual)中2.1.1.1节的内容，我们在minicom中将ttyUSB2设置为连接路径，波特率设置为115200。

![](./image%20for%20flash/uart.png)

```
sudo minicom -D /dev/ttyUSB2 -b 115200
```

插入准备好的含有bootloader文件的U盘。

按下电源键启动后，观察minicom窗口内，按Ctrl+C打断机器。

![](./image%20for%20flash/打断启动.png)

执行下面的命令，查看U盘内的文件。

```
usb start

fatls usb 0
```

![](./image%20for%20flash/查看u盘.png)

确认U盘内文件正确后执行下面命令

```
fatload usb 0 0x90000000 bootloader_secboot_ddr5_hifive-p550.bin
```

![]()

重启后再次打断机器执行分区（第一次刷写必选，需要给分区足够大小容纳刷写boot/root）

```
reset 
# 打断uboot启动
run gpt_partition 
```

![](./image%20for%20flash/执行分区.png)

### boot&rootfs

在启动并打断机器后输入以下命令进入fastboot状态

```
fastboot usb 0
```

![](./image%20for%20flash/进入fastboot状态.png)

在主机上另开一个终端，执行刷写命令

```
sudo fastboot flash boot boot-eswin_evb-20241015-120631.ext4 # 刷写boot
sudo fastboot flash root root-eswin_evb-20241015-120631.ext4 # 刷写rootfs
# 请注意文件路径 刷写时间大约在5-10分钟左右
```

返回minicom端口后按下Ctrl+C 取消 fastboot 状态，随后执行reset重启机器。

至此rockOS镜像刷写完成。

![](./image%20for%20flash/neofetch.png)