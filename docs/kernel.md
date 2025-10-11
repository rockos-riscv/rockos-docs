# 构建内核

本文提供了构建内核 deb 包的方式，包括原生编译和交叉编译。

您可在 RockOS 进行原生编译；下文所示的交叉编译步骤在 Debian 13 (Trixie) 环境已经过验证。

编译产物为 `.deb` 包，位于内核源代码目录上一级，可使用 `dpkg -i` 进行安装。

## 原生编译

```shell
#!/bin/sh
sudo apt update; sudo apt install -y git gdisk dosfstools build-essential \
                                  libncurses-dev gawk flex bison openssl libssl-dev tree \
                                  dkms libelf-dev libudev-dev libpci-dev libiberty-dev autoconf \
                                  device-tree-compiler xz-utils devscripts ccache debhelper asciidoc \
                                  bc rsync cpio bc rsync cpio python3-dev wget gcc
export board=win2030
git clone --depth=1 https://github.com/rockos-riscv/rockos-kernel
pushd rockos-kernel
export KDEB_PKGVERSION="$(make kernelversion)-$(date "+%Y.%m.%d.%H.%M")+$(git rev-parse --short HEAD)"
make ${board}_defconfig
make -j$(nproc) dtbs
make -j$(nproc) bindeb-pkg LOCALVERSION="-${board}"
# The debs file will be generated at ../
popd
```

## 交叉编译

以 Debian 13 (Trixie) 为例。

如有需要，您也可以在 Docker 容器中进行编译操作。

提示：截止本文撰写时，Debian 13 使用 `GCC 14.2`。

```shell
#!/bin/sh
sudo apt update; sudo apt install -y git gdisk dosfstools build-essential \
                                  libncurses-dev gawk flex bison openssl libssl-dev tree \
                                  dkms libelf-dev libudev-dev libpci-dev libiberty-dev autoconf \
                                  device-tree-compiler xz-utils devscripts ccache debhelper asciidoc \
                                  bc rsync cpio bc rsync cpio python3-dev wget gcc-riscv64-linux-gnu
export ARCH=riscv
export board=win2030
export CROSS_COMPILE=riscv64-linux-gnu-
git clone --depth=1 https://github.com/rockos-riscv/rockos-kernel
pushd rockos-kernel
export KDEB_PKGVERSION="$(make kernelversion)-$(date "+%Y.%m.%d.%H.%M")+$(git rev-parse --short HEAD)"
make ${board}_defconfig
make -j$(nproc) dtbs
make -j$(nproc) bindeb-pkg LOCALVERSION="-${board}"
# The debs file will be generated at ../
popd
```