# RockOS Image Flashing Guide

## Environment

Host System Version: Ubuntu 22.04

Minicom Version: 2.8

Fastboot Version: 28.0.2-debian

## Preparation

### Hardware Requirements

- USB Type A to USB Type C cable
- USB Type A to USB Type A cable
- A USB drive formatted to FAT32

### Image Downloads

- Bootloader: [Download here](https://mirror.iscas.ac.cn/rockos/extra/images/evb1/0930/20241015/bootloader_secboot_ddr5_hifive-p550.bin)

- Boot: [Download here](https://mirror.iscas.ac.cn/rockos/extra/images/evb1/0930/20241015/boot-eswin_evb-20241015-120631.ext4.zst)

- Rootfs: [Download here](https://mirror.iscas.ac.cn/rockos/extra/images/evb1/0930/20241015/root-eswin_evb-20241015-120631.ext4.zst)

After downloading, please extract the boot and rootfs files. Copy the bootloader file to the USB drive formatted in FAT32.

## Flashing the Image

Connect the board to the host system using both the USB Type A to USB Type C and USB Type A to USB Type A cables.

According to Section 3.1.6 of the [official user manual](https://sifive.cdn.prismic.io/sifive/ZxLYXYF3NbkBXux1_HF106_user_guide_V1p0_zh_Final.pdf):

- Insert the USB Type A to USB Type A cable into the upper port of the dual USB Type-A connector labeled as #10.
- Insert the USB Type A to USB Type C cable into the Type-C USB connector labeled as #15.

### Bootloader

First, establish a serial connection to the board. Once the cables are correctly connected, the board will be listed as four UARTs.

![](./image%20for%20flash/tty.png)

Following Section 2.1.1.1 of the [MCU User Manual](https://www.sifive.cn/api/document-file?uid=premier-p550-mcu-user-manual), set the ttyUSB2 as the connection path in minicom, and set the baud rate to 115200.

![](./image%20for%20flash/uart.png)

```bash
sudo minicom -D /dev/ttyUSB2 -b 115200
```

Insert the prepared USB drive containing the bootloader file.

After pressing the power button to boot, observe the minicom window and interrupt the U-Boot booting by pressing Ctrl+C or enter.

![](./image%20for%20flash/Interrupt.png)

Execute the following commands to check the files on the USB drive:

```bash
usb start

fatls usb 0
```

![](./image%20for%20flash/check-usb.png)

After verifying the correct files on the USB drive, execute the following commands:

```bash
fatload usb 0 0x90000000 bootloader_secboot_ddr5_hifive-p550.bin

es_burn write 0x90000000 flash
```

![]()

After rebooting, interrupt the U-Boot booting again and execute the partitioning command (required for the first flash to allocate sufficient space for the boot/root images).

```bash
reset
# Interrupt U-Boot startup
run gpt_partition
```

![](./image%20for%20flash/gpt_partition.png)

### Boot & Rootfs

After booting and interrupting the U-Boot booting, enter the following command to enter fastboot mode:

```bash
fastboot usb 0
```

![](./image%20for%20flash/fastboot0.png)

Open another terminal on the host and execute the following flashing commands:

```bash
sudo fastboot flash boot boot-eswin_evb-20241015-120631.ext4   # Flash boot
sudo fastboot flash root root-eswin_evb-20241015-120631.ext4   # Flash rootfs
# Ensure the file paths are correct; flashing time may take 10 minutes
```

Return to the minicom terminal, press Ctrl+C or enter to exit fastboot mode, and execute `reset` to reboot the machine.

At this point, the RockOS image flashing is complete.

![](./image%20for%20flash/neofetch.png)