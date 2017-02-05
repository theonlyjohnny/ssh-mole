#!/bin/bash

function hasNode(){
    if which node > /dev/null; then
        return 0 
    else
        return 1 
    fi
}

hasNvm(){
    if command -v nvm = "nvm"; then
        return 1
    else
        return 0
    fi
}

installNvm(){
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
    export NVM_DIR="/Users/$USER/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [[ -r $NVM_DIR/bash_completion ]] && . $NVM_DIR/bash_completion
}

nvmUpdate(){
    . ~/.nvm/nvm.sh
    nvm install node
    nvm use node
    return
}

updateNode(){
    if hasNvm; then
        nvmUpdate
        return
    else
        installNvm
        nvmUpdate
        return
    fi
}

runMole(){
    # node ./classes/ssh.js
    if $1="local";
        then
        node "./index.js"
    else
        node "~/.lol/bundle.js"
    fi;
}

if [ $HOSTNAME="ip-192-168-1-13.us-west-1.compute.internal" ];
    then
    $LOCAL_ENV="local"
else
    $LOCAL_ENV="prod"
fi

if hasNode; then
    updateNode
    runMole "$LOCAL_ENV"
else
    installNode
    updateNode
    runMole "$LOCAL_ENV"
fi
