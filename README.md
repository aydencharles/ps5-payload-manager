<p align="center">
 <img src="./assets/icon0.png" width="128" />
</p>
<h1 align="center">PS5 Payload Manager</h1>

[English](./README_EN.md) | **简体中文**

> 本仓库是原始项目的 fork。此 fork 增加了 i18n 支持，目前支持中文和英文。

<p align="center">一个现代化的 Web 管理面板，方便你在 PS5 上管理、导入和自动加载 payload。</p>

<p align="center">
 <img src="./pldmgr_screenshot.png" width="600" />
</p>

## 功能
- **Web 界面**：通过电脑、手机或 PS5 本身管理 payload。
- **导入 Payload**：从 USB 设备添加新的 payload，或从云端仓库下载。
- **自动启动**：配置启动列表，在管理器启动时自动加载指定 payload。
- **主屏幕快捷方式**：在 PS5 主屏幕安装专用的 “Payload Manager” 应用图标，方便快速访问。
- **自动关闭光盘播放器**：可选设置，在启动时自动关闭光盘播放器（适用于 BD-JB 用户）。


## 安装

### 使用 Autoloader（推荐）
强烈建议将 **Payload Manager** 与 **Autoloader** 配合使用：

[Y2JB](https://github.com/itsPLK/ps5-y2jb-autoloader) | [BD-JB](https://github.com/itsPLK/ps5-bdjb-autoloader) | [Lua](https://github.com/itsPLK/ps5-lua-autoloader)

上述链接中的最新版 Autoloader 已默认包含 `pldmgr.elf`。

如果你正在使用旧版本，并且不想更新整个 autoloader，只需：
1. 将 `pldmgr.elf` 放入 `autoload` 目录。
2. 在 `autoload.txt` 配置文件中仅添加 `pldmgr.elf`。

### 独立运行 / 手动加载
你也可以像加载其他 `.elf` 文件一样手动加载管理器。请从 [Releases](https://github.com/itsPLK/ps5-payload-manager/releases) 页面获取最新版本。

## 致谢
- [John Törnblom](https://github.com/john-tornblom) - 提供 [shell UI 安装程序](https://github.com/ps5-payload-dev/ftpsrv/blob/master/install-ps5.c)，以及作为参考的多个 payload。
- [BenNoxXD](https://github.com/BenNoxXD) - 提供 [光盘播放器应用终止逻辑](https://github.com/BenNoxXD/PS5-BDJ-HEN-loader/blob/main/HENloader_C_part/src/kill_disc_player.c)。
- 所有为 PS5 自制软件社区做出贡献的人。

## 捐赠
如果你希望支持原作者的工作，请查看 [DONATE.md](DONATE.md) 文件。

## 开发
有关构建说明和部署细节，请查看 [DEVELOPMENT.md](DEVELOPMENT.md)。
