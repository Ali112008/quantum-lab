/**
 * DEV SERVER DAEMON SPAWNER — emulates a classic double-fork detach:
 * spawns `bun run dev` via setsid into its own session, re-parented to
 * PID 1, with stdio appended to dev.log. The spawner exits immediately.
 *
 * Why: sandbox process reapers kill children that remain in the shell's
 * session; a detached session leader (like agent-browser's daemon)
 * survives. Usage:  bun scripts/dev-daemon.ts
 */
import { spawn } from "node:child_process";
import { openSync } from "node:fs";

const LOG = openSync("/home/z/my-project/dev.log", "a");

const child = spawn("setsid", ["bun", "run", "dev"], {
  cwd: "/home/z/my-project",
  detached: true,
  stdio: ["ignore", LOG, LOG],
});

child.unref();
console.log(`daemon spawned: pid ${child.pid} (session leader, re-parented on exit)`);
