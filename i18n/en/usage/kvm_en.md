# RockOS KVM Demo

## Environment

- OS Version: 20241030
- Ubuntu preinstalled image: https://cdimage.ubuntu.com/releases/24.10/release/ubuntu-24.10-preinstalled-server-riscv64.img.xz
    - You can try other mirrors if the official server is too slow for you
- `qemu-system-riscv64` is installed by default
- Manually install `wget` or `curl` to download the image

## Prerequisites

Currently QEMU does not support loading M Mode firmware via `-bios` while KVM is enabled. See comments [here](https://github.com/qemu/qemu/blob/fdf250e5a37830615e324017cb3a503e84b3712c/hw/riscv/virt.c#L1354).

The only way to start a KVM for now is using `initrd` and `kernel` flags.

Thus we need to extract `initrd` and `vmlinuz` images from the Ubuntu preinstalled image.

We're using Ubuntu 24.10 preinstalled server image as an example here. Feel free try other distros as well using the same method below.

```shell
wget https://cdimage.ubuntu.com/releases/24.10/release/ubuntu-24.10-preinstalled-server-riscv64.img.xz
xz -d ubuntu-24.10-preinstalled-server-riscv64.img.xz
sudo losetup -f # Check the first available loop device, usually /dev/loop0
sudo losetup -P loop0 ubuntu-24.10-preinstalled-server-riscv64.img
sudo fdisk -l /dev/loop0 # Check partition table
sudo mount /dev/loop0p1 # By default the first partition is the rootfs
ls /mnt/boot
cp /mnt/boot/initrd.img .
sudo cp /mnt/boot/vmlinuz .
sudo umount /mnt
sudo losetup -D # Detach all loop devices
```

By default RockOS does not load KVM module on boot, you'll need to manually load it:

```shell
sudo modprobe kvm
```

## Start KVM

Run:

```shell
sudo qemu-system-riscv64 --enable-kvm -M virt -cpu host -m 2048 -smp 2 -nographic \
        -device virtio-net-device,netdev=eth0 -netdev user,id=eth0 \
        -device virtio-rng-pci \
        -kernel vmlinuz \
        -initrd initrd.img \
        -append "root=LABEL=cloudimg-rootfs ro  efi=debug earlycon=sbi" \
        -drive file=ubuntu-24.10-preinstalled-server-riscv64.img,format=raw,if=virtio
```

Starts the virtual machine.

The default username and password are both `ubuntu`.

For Ubuntu preinstalled image, you'll be prompted to change your password on first boot. Follow the steps and you're good to go.