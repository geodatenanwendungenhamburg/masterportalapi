/* eslint-disable */
const fs = require("fs");
const path = require("path");
const {execSync} = require("child_process");
const semver = require("semver");

const root = path.resolve(__dirname);
const pkgPath = path.join(root, "package.json");
const changelogPath = path.join(root, "CHANGELOG.md");
const publiccodePath = path.join(root, "publiccode.yml");

function run(cmd) {
    // All comments must stay in English only
    console.log(`\n> ${cmd}`);
    execSync(cmd, {stdio: "inherit", cwd: root});
}

function printBanner() {
    console.log("=====================");
    console.log("   LGV   —   G32");
    console.log(" masterportalapi");
    console.log("=====================\n");
}

function todayDateString() {
    // Returns yyyy-mm-dd
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function updateChangelogForRelease(newVersion, dateStr) {
    if (!fs.existsSync(changelogPath)) {
        throw new Error("CHANGELOG.md not found.");
    }
    let content = fs.readFileSync(changelogPath, "utf8");

    // 1) Rename "Unreleased - in development" to "x.x.x - yyyy-mm-dd"
    const unreleasedHeader = "## Unreleased - in development";
    if (!content.includes(unreleasedHeader)) {
        throw new Error(
            'CHANGELOG.md does not contain "## Unreleased - in development".'
        );
    }

    const newHeader = `## ${newVersion} - ${dateStr}`;
    content = content.replace(unreleasedHeader, newHeader);

    // NOTE: Removing empty categories automatically is tricky and depends on the exact format.
    // For now we keep the categories and let the developer clean up if needed.

    fs.writeFileSync(changelogPath, content, "utf8");
}

function addUnreleasedSectionToChangelog() {
    if (!fs.existsSync(changelogPath)) {
        throw new Error("CHANGELOG.md not found.");
    }
    let content = fs.readFileSync(changelogPath, "utf8");

    const unreleasedHeader = "## Unreleased - in development";
    if (content.includes(unreleasedHeader)) {
        // Section already exists, nothing to do
        return;
    }

    const block = [
        "## Unreleased - in development",
        "### __Breaking Changes__",
        "",
        "### Added",
        "",
        "### Changed",
        "",
        "### Deprecated",
        "",
        "### Removed",
        "",
        "### Fixed",
        "",
        ""
    ].join("\n");

    // Prepend new unreleased block at the top (after possible title line)
    content = block + content;
    fs.writeFileSync(changelogPath, content, "utf8");
}

function updatePubliccodeYml(newVersion, dateStr) {
    if (!fs.existsSync(publiccodePath)) {
        console.warn("publiccode.yml not found, skipping update.");
        return;
    }

    let content = fs.readFileSync(publiccodePath, "utf8");

    // Very simple line-based replacement for version and releaseDate
    content = content.replace(
        /^version:\s*.*$/m,
        `version: ${newVersion}`
    );
    content = content.replace(
        /^releaseDate:\s*.*$/m,
        `releaseDate: ${dateStr}`
    );

    fs.writeFileSync(publiccodePath, content, "utf8");
}

module.exports = function (plop) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const currentVersion = pkg.version || "0.0.0";

    const nextPatch = semver.inc(currentVersion, "patch");
    const nextMinor = semver.inc(currentVersion, "minor");
    const nextMajor = semver.inc(currentVersion, "major");

    plop.setActionType("runRelease", function (answers) {
        printBanner();

        console.log(
            "Please ensure that all required pull requests are merged into the master branch before continuing.\n"
        );

        // 1) Ensure clean git working tree
        const status = execSync("git status --porcelain", {cwd: root})
            .toString()
            .trim();
        if (status) {
            throw new Error(
                "Git working tree is not clean. Please commit or stash changes first."
            );
        }

        // 2) Checkout master and update repo
        const releaseBranch = "master"; // change to "main" if needed
       // run(`git checkout ${releaseBranch}`);
        run("git fetch --tags");
        run("git pull");

        // 3) Determine new version and date
        const dateStr = todayDateString();

        const freshPkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        const freshCurrentVersion = freshPkg.version;

        let newVersion;
        if (answers.releaseType === "manual") {
            newVersion = answers.manualVersion;
        }
        else {
            newVersion = semver.inc(freshCurrentVersion, answers.releaseType);
        }

        if (!newVersion) {
            throw new Error("Failed to calculate new version.");
        }

        console.log(`\nCurrent version: ${freshCurrentVersion}`);
        console.log(`New version:     ${newVersion}`);
        console.log(`Release date:    ${dateStr}\n`);

        // 4) Update CHANGELOG: Unreleased -> x.x.x - yyyy-mm-dd
        updateChangelogForRelease(newVersion, dateStr);

        // 5) Update publiccode.yml (version + releaseDate)
        updatePubliccodeYml(newVersion, dateStr);

        // 6) Update package.json version
        freshPkg.version = newVersion;
        fs.writeFileSync(
            pkgPath,
            JSON.stringify(freshPkg, null, 2) + "\n",
            "utf8"
        );

        // 7) Run npm ci so package-lock.json gets updated
        run("npm i"); // TODO: revert to npm ci later

        // 8) Commit: update changelog and version to x.x.x
        run(`git commit -a -m "update changelog and version to ${newVersion}"`);

        // 9) Create  tag: vx.x.x
        run(`git tag v${newVersion} -m "Release v${newVersion}"`);

        // 10) List tags for control
        //run("git tag -l"); // TODO: not good 
         // 10) Confirm tag exists
        const tagsAfter = execSync("git tag -l", {cwd: root})
       .toString()
       .split("\n")
       .map((t) => t.trim())
       .filter(Boolean);

       if (tagsAfter.includes(`v${newVersion}`)) {
        console.log(`\n✔️ Tag v${newVersion} created successfully.`);
        }
     else {
    throw new Error(
     `❌ Tag v${newVersion} was NOT created. Please check Git manually.`
     );
     }

        

        // 11) Push tag to origin
       // run(`git push origin v${newVersion}`);

        // 12) Optional npm publish (must happen before creating new Unreleased section)
        if (answers.publishToNpm) {
            console.log(
                "\nYou chose to publish this version to npm."
            );
            console.log(
                "Step 1: npm login (this will show you a URL to open in the browser and trigger the email with the OTP)."
            );
        
            // Step 1: ensure npm login (will open URL in terminal)
            console.log("\n> npm login");
            try {
                // All comments must stay in English only
                // This will print the login URL, you open it in the browser, log in,
                // and confirm the OTP flow for the account.
                execSync("npm login", {stdio: "inherit", cwd: root});
            }
            catch (err) {
                console.warn(
                    "\nWARNING: npm login failed. No package was published."
                );
                throw err;
            }
        
            console.log(
                "\nStep 2: npm publish --access public (this will ask for the OTP in the terminal)."
            );
        
            // Step 2: run npm publish, this should now ask for the OTP in the terminal
            console.log("\n> npm publish --access public");
            try {
                execSync("npm publish --access public", {stdio: "inherit", cwd: root});
            }
            catch (err) {
                console.warn(
                    "\nWARNING: npm publish failed. Please check the error above. No version was published."
                );
                throw err;
            }
        }
        

        console.log(
            "\nPlease check the pipeline / opencode to ensure the new version was transferred correctly."
        );

        // 13) Add new Unreleased - in development section to CHANGELOG
        addUnreleasedSectionToChangelog();

        // 14) Commit: add entry for Unreleased - in development
        run(
            'git commit -a -m "add entry for Unreleased - in development to the changelog"'
        );

        // 15) Push branch changes
       // run("git push");

        return `Release v${newVersion} finished successfully.`;
    });

    plop.setGenerator("release", {
        description: "Release masterportalapi according to internal release guide",
        prompts: (() => {
            console.log("Release masterportalapi according to internal release guide");
            // Print banner BEFORE prompts
            console.log("=====================");
            console.log("   LGV   —   G32");
            console.log(" masterportalapi");
            console.log("=====================\n");
        
            return [
                {
                    type: "list",
                    name: "releaseType",
                    message: `Select release type (current: ${currentVersion})`,
                    choices: [
                        {name: `patch (${nextPatch})`, value: "patch"},
                        {name: `minor (${nextMinor})`, value: "minor"},
                        {name: `major (${nextMajor})`, value: "major"},
                        {name: "manual version", value: "manual"}
                    ]
                },
                {
                    type: "input",
                    name: "manualVersion",
                    message: "Enter new version (e.g. 2.53.0):",
                    when: (answers) => answers.releaseType === "manual",
                    validate: (input) =>
                        semver.valid(input)
                            ? true
                            : "Please enter a valid semver version (e.g. 1.2.3)."
                },
                {
                    type: "confirm",
                    name: "publishToNpm",
                    message: "Publish this version to npm now?",
                    default: false
                }
            ];
        })(),
        actions: [
            {
                type: "runRelease"
            }
        ]
    });
};
