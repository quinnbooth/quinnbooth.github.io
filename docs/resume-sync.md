# Résumé auto-update

The site always links to `/resume/quinn-booth-resume.pdf`. On every deploy, the
workflow in `.github/workflows/deploy.yml` tries to replace that file with the
latest version from wherever the résumé actually lives.

## One-time setup

1. **Point the site at your résumé.** In this repo, go to
   *Settings → Secrets and variables → Actions → Variables* and add
   `RESUME_URL`. Any URL that returns the PDF works. For a PDF committed to a
   public repo called `resume`:

   ```
   https://raw.githubusercontent.com/quinnbooth/resume/main/resume.pdf
   ```

   If the repo is private, use the GitHub API contents URL instead and add a
   fine-grained token with read access to that repo as the secret
   `RESUME_TOKEN`:

   ```
   https://api.github.com/repos/quinnbooth/resume/contents/resume.pdf
   ```

   (The workflow sends `Accept: application/octet-stream`, which makes the API
   return the raw file.)

2. **Make résumé changes trigger a deploy.** Add this workflow to the résumé
   repo as `.github/workflows/notify-site.yml`. It needs a secret `SITE_TOKEN`:
   a fine-grained token with *Contents: read and write* on
   `quinnbooth/quinnbooth.github.io` (that's the permission the dispatch API
   requires).

   ```yaml
   name: Notify website
   on:
     push:
       branches: [main]
       paths: ['**.pdf']
   jobs:
     ping:
       runs-on: ubuntu-latest
       steps:
         - run: |
             curl -fsSL -X POST \
               -H "Authorization: Bearer ${{ secrets.SITE_TOKEN }}" \
               -H "Accept: application/vnd.github+json" \
               https://api.github.com/repos/quinnbooth/quinnbooth.github.io/dispatches \
               -d '{"event_type":"resume-updated"}'
   ```

   If the résumé is built from LaTeX in that repo, run this step after the
   build step that produces the PDF.

Push a new résumé, and the site redeploys with it within a couple of minutes.
Even without step 2, the weekly scheduled build picks up changes.

## If something goes wrong

If the download fails or doesn't return a PDF, the build logs a warning and
ships the copy committed in `public/resume/`, so the link never breaks.
