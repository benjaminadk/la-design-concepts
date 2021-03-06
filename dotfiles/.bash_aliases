alias bashreload="source ~/.bashrc && echo Bash config reloaded" # reload bashrc
alias histg="history | grep" # seach history $1
alias mkdir="mkdir -pv"  # make parent dirs as needed
alias q="exit" # quit
alias c='clear' # clear screen
alias h="history" # print command history
alias p="cat" # print file
alias ~='cd ~' # home dir
alias cd..='cd ..' # back one dir
alias ..='cd ..' # back one dir
alias ...='cd ../../' # back two dirs
alias ....='cd ../../../' # back three dirs
alias .....='cd ../../../../' # back four dirs
alias ll='ls -alF' # list all files with detail
alias la='ls -A' # list all
alias l='ls -CF' # list
alias df="df -Tha --total" # disk usage
alias free="free -mt" # free memory
alias ps="ps auxf" # process list
alias psg="ps aux | grep -v grep | grep -i -e VSZ -e" # process search follow with search term
alias json="python -m json.tool" # format json
alias env="printenv" # print environment vars
alias bashrc="vim ~/.bashrc" # open .bashrc
alias bashal="vim ~/.bash_aliases" # open .bash_alias
alias rmnm="rm -rf ./node_modules"
alias sshla="ssh root@192.241.239.223"
alias sshladb="ssh root@192.241.196.148"
alias sshladev="ssh root@159.65.108.255"
alias sshladev3="ssh root@198.199.113.6"
alias sshwp="ssh ben@178.128.183.170"
alias sshbvg="ssh ben@159.65.64.237"
alias sshlap="ssh root@144.126.208.127"
alias pub="cd /sites/ladesignconcepts.com/public/"
alias flush="wp cache flush --allow-root"

# print PATH
function path(){
    old=$IFS
    IFS=:
    printf "%s\n" $PATH
    IFS=$old
}

# create directory and cd into it
function mcd(){
    mkdir $1
    cd $1
}

# run bats
function bats(){
    BATS_RUN_SKIPPED=true ~/bats/libexec/bats $1
}

function pjs() {
    node -pe "require('./package.json').scripts" 
}

function lowercase() {
   for i in *; 
   	do mv $i `echo $i | tr [:upper:] [:lower:]`; 
   done
}

