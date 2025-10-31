import { constants } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const TS_EXTENSIONS = new Set([".ts", ".tsx"]);
const { F_OK } = constants;

export async function resolve(specifier, context, defaultResolve) {
  const attempt = await tryResolveTs(specifier, context.parentURL);
  if (attempt) {
    return attempt;
  }

  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (TS_EXTENSIONS.has(getExtension(url))) {
    const source = await readFile(fileURLToPath(url), "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        target: ts.ScriptTarget.ES2017,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
      fileName: fileURLToPath(url),
    });

    return {
      source: outputText,
      format: "module",
      shortCircuit: true,
    };
  }

  return defaultLoad(url, context, defaultLoad);
}

const tryResolveTs = async (specifier, parentURL = import.meta.url) => {
  const explicitExtension = getExtension(specifier);

  if (TS_EXTENSIONS.has(explicitExtension)) {
    const url = new URL(specifier, parentURL);
    return { url: url.href, shortCircuit: true };
  }

  if (!explicitExtension && isFilePath(specifier)) {
    for (const extension of TS_EXTENSIONS) {
      const candidate = new URL(`${specifier}${extension}`, parentURL);
      if (await exists(candidate)) {
        return { url: candidate.href, shortCircuit: true };
      }
    }
  }

  return null;
};

const getExtension = (value) => {
  const lower = value.toLowerCase();
  if (lower.endsWith(".tsx")) return ".tsx";
  if (lower.endsWith(".ts")) return ".ts";
  return "";
};

const isFilePath = (specifier) =>
  specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("file:");

const exists = async (url) => {
  try {
    await access(fileURLToPath(url), F_OK);
    return true;
  } catch {
    return false;
  }
};
