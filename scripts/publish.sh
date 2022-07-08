if [ "$1" ];
then
    npm --no-git-tag-version version $1
    VERSION=$1
else
    npm version prerelease --no-git-tag-version
    VERSION=$(node -p  "require('./package.json').version")
fi
    # node scripts/weappversion.js  $VERSION --replace public/manifest.webapp 
    # git add .
    # git commit -am "update version v$VERSION"
    # git tag v$VERSION
    echo "\nVersion v$VERSION update succeeded!\n"

    rm -rf dist/styles && gulp --gulpfile scripts/build-style.js

    rm -rf ./lib && tsc

    echo "\nbuild success!\n\nstart publish..."

    npm publish

    if [ "$?" -eq 0 ]; 

    then
    echo "\n npm publish success!\n"
    git add .
    
    else 
    echo "\n npm publish failed!\n"
    fi