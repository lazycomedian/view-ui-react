if [ "$1" ];
then
    npm --no-git-tag-version version $1
    VERSION=$1
else
    npm --no-git-tag-version version patch
    VERSION=$(node -p  "require('./package.json').version")
fi
    # node scripts/weappversion.js  $VERSION --replace public/manifest.webapp 
    git add .
    git commit -am "update version v$VERSION"
    git tag v$VERSION
    echo "\nVersion v$VERSION update succeeded!\n"

