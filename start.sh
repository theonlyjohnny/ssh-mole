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
    node ./ssh.js
    node ./index.js
}

if hasNode; then
    updateNode
    runMole
else
    installNode
    updateNode
    runMole
fi