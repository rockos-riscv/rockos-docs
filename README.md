# 关于 RockOS

RockOS 是 PLCT 实验室支持开发的面向 EIC77 系列芯片生态的 Debian 优化发行版，不仅针对 ESWIN EIC77 系列芯片和 SiFive P550 高性能 CPU 进行了全面适配和优化，特别强化了虚拟化能力。通过深度调优，RockOS 实现了对虚拟机和容器的高效支持，可满足多样化需求。目前，RockOS 已成功运行在 HiFive Premier P550 和 Milk-V Megrez 开发板上，为 RISC-V 生态的进一步发展提供了强有力的技术支撑。

# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
