---
title: Deploying a PHP/Composer site with GitHub Actions and SSH
---

Recently I decided to finally get a decent deploy process put together for this site. I'd recently moved back to GitHub after spending a while on GitLab, and being accustomed to using a private GitLab instance for all my source control at work. So I've been a bit out of the loop as far as what's going on over in GitHub.

I was pleasantly surprised to find a pretty excellent set of tools for automated workflows though, in [GitHub Actions](https://github.com/features/actions). Honestly, I like GitHub Actions so much that I'm seriously considering moving my work projects over to GitHub, just so that I can use actions instead of GitLab runners.

As a hardcore n00b to GitHub Actions though, I thought it might be useful for me to create a tutorial on how to do a dead-simple SSH deployment via GitHub Actions, in a way that should make sense for a lot of PHP/Composer websites.

## My setup

My site is set up such that the source code all lives in [a public GitHub repo](https://github.com/jobyone/byjoby.com). There's not a whole lot to it, honestly. It's got the typical Composer stuff, and a bit of glue code and configuration files to hold together all the libraries that make it work.

The site is hosted on a DigitalOcean droplet, so it's a tiny little VM that I have root access to, so I can configure it however it needs to be for this project. Your process may have to be slightly different if your hosting is different.

Deploying only requires doing `git pull`, resetting to the appropriate commit, and `composer install` too, so it's not like there's a massive amount of work that needs to be done over this SSH connection.

## Setting up my environment

Setting up my environment was very easy. I already had Apache configured to host www.byjoby.com from `/var/www.byjoby.com/web`, and since the repo is public, getting a git copy running was as easy as

```bash
rm -rf /var/www.byjoby.com/*
git clone git@github.com:jobyone/byjoby.com.git /var/www.byjoby.com
```

## Setting up the necessary secrets in GitHub

Navigate to your source repo, and click on "Settings" then "Secrets." You'll need to ensure that you have the following secrets set:

* HOST: set to the hostname of your server
* KEY: the private key of an authorized key for accessing the server
* PATH: the root path where your repo will be deployed to (in my case `/var/www.byjoby.com/`)
* USERNAME: the username associated with the KEY

## Setting up the deploy configuration

### What the deploy script needs to do

The deploy script needs to do three basic things:

1. Connect to the server
2. Pull the git repo and reset the state to the correct commit
3. Install the appropriate Composer dependencies

So fundamentally the commands that need to run once the server SSH connection is established are:

```bash
cd ${{ secrets.PATH }}
git pull
git reset --hard $GITHUB_SHA
git clean -f -d
composer install
```

### deploy.yml

I've decided to name my workflow "SSH Deploy" and save its configuration in a file called deploy.yml. To copy my configuration, create the following file in your source code repo at `.github/workflows/deploy.yml`.

```yaml
name: SSH Deploy

# this section controls when this workflow runs, in my case
# it runs whenever I push to the main branch
on:
  push:
    branches: [ main ]

# this section runs the necessary scripting, using a helpful
# third-party action that helps set up and execute SSH commands
jobs:
  build:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
      - name: update content with Git, install Composer dependencies
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd ${{ secrets.PATH }}
            git pull
            git reset --hard $GITHUB_SHA
            git clean -f -d
            composer install
```

## More information

I've used a pretty great third-party action to help coordinate the SSH connection. You could do it all by hand, but it's so much easier this way. I suggest you check out the [appleboy/ssh-action](https://github.com/appleboy/ssh-action) repo for more information, including a lot of examples of how to execute SSH on a server as a GitHub action.
