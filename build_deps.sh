#!/usr/bin/env bash
# Build third-party dependencies with an installed PS5 Payload SDK.
set -e

if [ -z "${PS5_PAYLOAD_SDK:-}" ]; then
  echo "error: PS5_PAYLOAD_SDK is not set" >&2
  exit 1
fi

SDK_TARGET_DIR="$PS5_PAYLOAD_SDK/target"
BUILD_JOBS=$(getconf _NPROCESSORS_ONLN 2>/dev/null || nproc 2>/dev/null || echo 1)

export PATH="$PS5_PAYLOAD_SDK/bin:$PATH"

TEMPDIR=$(mktemp -d)
trap 'rm -rf -- "$TEMPDIR"' EXIT

cd "$TEMPDIR"

# Common compiler tools mapped to SDK wrappers
export CC=prospero-clang
export CXX=prospero-clang++
export AR=prospero-ar
export NM=prospero-nm
export RANLIB=prospero-ranlib

echo "=== 1. Building libmicrohttpd 1.0.1 ==="
wget -O libmicrohttpd.tar.gz https://ftp.gnu.org/gnu/libmicrohttpd/libmicrohttpd-1.0.1.tar.gz
tar xf libmicrohttpd.tar.gz
cd libmicrohttpd-1.0.1
./configure --host=x86_64-pc-freebsd12 \
            --disable-shared --enable-static \
            --disable-curl --disable-examples \
            --prefix="$SDK_TARGET_DIR"
make -j"$BUILD_JOBS"
make install

cd "$TEMPDIR"

echo "=== 2. Building mbedTLS 3.6.0 ==="
wget -O mbedtls.tar.gz https://github.com/Mbed-TLS/mbedtls/archive/refs/tags/v3.6.0.tar.gz
tar xf mbedtls.tar.gz
cd mbedtls-*
make CC=prospero-clang AR=prospero-ar RANLIB=prospero-ranlib CFLAGS="-Os" lib -j"$BUILD_JOBS"
mkdir -p "$SDK_TARGET_DIR/include"
cp -r include/mbedtls include/psa "$SDK_TARGET_DIR/include/"
mkdir -p "$SDK_TARGET_DIR/lib"
cp library/libmbedtls.a library/libmbedx509.a library/libmbedcrypto.a "$SDK_TARGET_DIR/lib/"

cd "$TEMPDIR"

echo "=== 3. Building libcurl 8.18.0 ==="
wget -O curl.tar.xz https://curl.haxx.se/download/curl-8.18.0.tar.xz
tar xf curl.tar.xz
cd curl-8.18.0
sed -i.bak 's|define USE_XATTR| |g' src/tool_xattr.h
rm src/tool_xattr.h.bak
wget -O ca-bundle.crt https://curl.se/ca/cacert.pem
./configure --prefix="$SDK_TARGET_DIR" \
            --host=x86_64-pc-freebsd \
            --enable-static --disable-shared \
            --with-mbedtls="$SDK_TARGET_DIR" \
            --without-openssl \
            --without-libpsl \
            --disable-docs \
            --disable-ftp --disable-ldap --disable-ldaps --disable-rtsp --disable-proxy --disable-dict --disable-telnet --disable-tftp --disable-pop3 --disable-imap --disable-smb --disable-smtp --disable-gopher --disable-mqtt
make -j"$BUILD_JOBS"
make install

echo "=== 4. Deploying CA bundle ==="
mkdir -p "$SDK_TARGET_DIR/etc"
cp ca-bundle.crt "$SDK_TARGET_DIR/etc/ca-bundle.crt"

echo "All SDK dependencies (libmicrohttpd, mbedTLS, libcurl) successfully built and installed!"
