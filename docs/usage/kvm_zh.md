# RockOS KVM 示例

## 演示环境

- 系统版本：20241030
- Ubuntu 预安装镜像：https://cdimage.ubuntu.com/releases/24.10/release/ubuntu-24.10-preinstalled-server-riscv64.img.xz
    - 若下载速度慢可以考虑更换其它镜像源
- 系统默认已预装 `qemu-system-riscv64`
- 需要手动安装 `wget` 或 `curl` 等下载工具以下载镜像

## 前置准备

由于 QEMU 目前不支持在启用了 KVM 的情况下加载 M Mode 固件（见 [此处源码](https://github.com/qemu/qemu/blob/fdf250e5a37830615e324017cb3a503e84b3712c/hw/riscv/virt.c#L1354)），目前仅支持使用 `-initrd` `-kernel` 方式启动系统。

因此，我们需要先从 Ubuntu 镜像中提取 `initrd` 和 `vmlinuz`。

此处以 Ubuntu 24.10 预安装服务器镜像为例，其他发行版镜像同理。

```shell
wget https://cdimage.ubuntu.com/releases/24.10/release/ubuntu-24.10-preinstalled-server-riscv64.img.xz
xz -dkv -T0 ubuntu-24.10-preinstalled-server-riscv64.img.xz
sudo losetup -f # 检查第一个可用的 loop 设备，一般默认为 /dev/loop0
sudo losetup -P loop0 ubuntu-24.10-preinstalled-server-riscv64.img
sudo fdisk -l /dev/loop0 # 默认第一个分区为 rootfs，请检查 fdisk 输出
sudo mount /dev/loop0p1
ls /mnt/boot
cp /mnt/boot/initrd.img .
sudo cp /mnt/boot/vmlinuz .
sudo umount /mnt
sudo losetup -D # 断开所有 loop 设备
```

RockOS 目前的镜像并未加载 KVM 内核模块，需要手动加载：

```shell
sudo modprobe kvm
```

## 启动 KVM

执行：

```shell
sudo qemu-system-riscv64 --enable-kvm -M virt -cpu host -m 2048 -smp 2 -nographic \
        -device virtio-net-device,netdev=eth0 -netdev user,id=eth0 \
        -device virtio-rng-pci \
        -kernel vmlinuz \
        -initrd initrd.img \
        -append "root=LABEL=cloudimg-rootfs ro  efi=debug earlycon=sbi" \
        -drive file=ubuntu-24.10-preinstalled-server-riscv64.img,format=raw,if=virtio
```

即可启动虚拟机。

默认用户名和密码均为 `ubuntu`。

Ubuntu 的预安装镜像在首次启动时会提示修改密码，按提示操作即可。