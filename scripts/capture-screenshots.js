#!/usr/bin/env node

const { spawn } = require("node:child_process");
const { mkdirSync, appendFileSync } = require("node:fs");
const { join } = require("node:path");
const http = require("node:http");

const baseUrl = "http://127.0.0.1:3000";
const artifactsRoot = join(process.cwd(), "__artifacts__", "responsive");

const pages = [
  { slug: "home", path: "/" },
  { slug: "packages", path: "/packages" },
  { slug: "process", path: "/process" },
  { slug: "contact", path: "/contact" },
];

const viewports = [360, 390, 768, 1024, 1280, 1440, 1920, 2560];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

mkdirSync(artifactsRoot, { recursive: true });
const logFile = join(artifactsRoot, "capture.log");

function log(message) {
  const timestamp = new Date().toISOString();
  appendFileSync(logFile, `${timestamp} ${message}\n`);
  process.stdout.write(`${message}\n`);
}

process.on("exit", (code) => {
  log(`Process exiting with code ${code}`);
});

process.on("SIGTERM", () => {
  log("Received SIGTERM");
});

process.on("SIGINT", () => {
  log("Received SIGINT");
});

async function waitForServer(url, attempts = 60) {
  const target = new URL(url);
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const isReady = await new Promise((resolve) => {
      const request = http.request(
        {
          method: "GET",
          hostname: target.hostname,
          port: target.port,
          path: target.pathname,
        },
        (response) => {
          response.resume();
          resolve(
            Boolean(response.statusCode && response.statusCode >= 200 && response.statusCode < 400),
          );
        },
      );

      request.on("error", () => resolve(false));
      request.end();
    });

    if (isReady) {
      return;
    }

    if ((attempt + 1) % 10 === 0) {
      log(
        `Waiting for server (${attempt + 1}/${attempts})…`,
      );
    }

    await sleep(500);
  }
  throw new Error("Development server did not start in time.");
}

function captureScreenshot(url, width, outputPath) {
  const height = width <= 768 ? 1280 : 1440;
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-sandbox",
    `--window-size=${width},${height}`,
    "--timeout=60000",
    "--virtual-time-budget=6000",
    `--screenshot=${outputPath}`,
    url,
  ];

  return new Promise((resolve, reject) => {
    const chrome = spawn("chromium", args, { stdio: "ignore" });
    chrome.on("error", reject);
    chrome.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Chromium exited with code ${code} for ${outputPath}`));
      }
    });
  });
}

async function run() {
  const devProcess = spawn(
    "npm",
    ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", "3000"],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        NODE_ENV: "development",
      },
    },
  );

  devProcess.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    if (process.env.DEBUG_CAPTURE === "1") {
      process.stdout.write(text);
    }
  });
  devProcess.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    if (process.env.DEBUG_CAPTURE === "1") {
      process.stderr.write(text);
    }
  });

  devProcess.on("exit", (code, signal) => {
    log(`Dev server exited with code ${code} and signal ${signal ?? "null"}`);
  });

  try {
    log("Waiting for development server to boot...");
    await waitForServer(baseUrl);
    log("Dev server ready, capturing responsive screenshots...");

    for (const page of pages) {
      const pageDir = join(artifactsRoot, page.slug);
      mkdirSync(pageDir, { recursive: true });

      for (const width of viewports) {
        const url = `${baseUrl}${page.path === "/" ? "" : page.path}`;
        const outputPath = join(pageDir, `${width}.png`);
        log(`Capturing ${page.slug} at ${width}px → ${outputPath}`);
        await captureScreenshot(url, width, outputPath);
      }
    }
  } finally {
    if (!devProcess.killed) {
      devProcess.kill("SIGINT");
    }
    await new Promise((resolve) => devProcess.on("exit", resolve));
  }
}

run().catch((error) => {
  log(
    `Capture failed: ${
      error instanceof Error ? error.message : JSON.stringify(error)
    }`,
  );
  console.error(error);
  process.exitCode = 1;
});
