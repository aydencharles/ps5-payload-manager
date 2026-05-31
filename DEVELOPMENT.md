# Development

This document describes how to build and deploy the **Payload Manager**.

## How to Build

### 1. Configure the SDK
Set `PS5_PAYLOAD_SDK` to your installed [PS5 Payload SDK](https://github.com/ps5-payload-dev/sdk):
```bash
export PS5_PAYLOAD_SDK=/path/to/ps5-payload-sdk
```

Install the third-party dependencies into the SDK once:
```bash
./build_deps.sh
```

### 2. Build the Frontend
You must build the React UI first. This converts the JSX into the `dist/index.html` file that gets embedded.
```bash
make frontend-build
```

### 3. Build the ELF
Use the locally installed SDK to compile the Payload Manager. It is recommended to run `make clean` if you updated the frontend.
```bash
make clean all
```

The resulting `pldmgr.elf` will be created in the root directory.

## Automated Deploy

For a quick build & deploy cycle, use the `deploy.sh` script. It builds with the locally installed SDK and sends the new ELF via `socat`.

```bash
./deploy.sh [PS5_IP]
```
(Requires PS5 IP as the first argument).

## Manual Deploy
1. Upload `pldmgr.elf` to your PS5 (e.g., via port 9021).
2. The menu will be available at `http://[PS5_IP]:8084`.
