import { APP_NAME, DOCUMENTATION_URL, GITHUB_URL } from "@/lib/app.const";

export function About() {
  return (
    <div className="mt-6 text-card-foreground p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-center mb-6">
        About {APP_NAME}
      </h2>
      <div className="space-y-4 max-w-2xl mx-auto text-center text-foreground">
        <p>
          This is an online 8-bit sound maker and sfx generator. All you need to
          make retro sound effects in a web browser.{" "}
        </p>
        <p>
          It's a modern port of{" "}
          <a
            href="https://github.com/chr15m/jsfxr"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            jsfxr
          </a>{" "}
          which is a port of the original{" "}
          <a
            href="https://www.drpetter.se/project_sfxr.html"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            sfxr
          </a>{" "}
          by DrPetter. <br />
          Made with TypeScript and React.
        </p>

        <div className="flex justify-center gap-2 pt-4">
          <a
            href={GITHUB_URL}
            className="text-primary hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source code
          </a>
          <span className="text-muted-foreground">•</span>
          <a
            href={DOCUMENTATION_URL}
            className="text-primary hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
