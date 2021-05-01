alert("This is a work in progress!")

let text = document.getElementById("textArea");
let prompt = document.getElementById("text");

let system = {
    "/": {
        //"README.md": {},
        //"test": {
        //    "lol": {
        //        "lmao": {}
        //    }
        //}
    }
}

let commands = {
    "ls": {},
    "echo [text]": {},
    "mkdir [name]": {},
    "cd [directory]": {}
    //"newusr [name password]": {}
}


let currentDirStr = "/";
let currentDir = system["/"];
let lastDir = system["/"];
let lastDirStr = "/";

function loadDirectoryFromString(str)
{
    let element = str.split("/")[0]
    if (str == '')
    {
        currentDir = system["/"]
        currentDirStr.split("/").forEach(folder => {
            if (folder != '')
            {
                currentDir = currentDir[folder]
            }
        })
        if (currentDir == undefined)
        {
            currentDir = lastDir
            currentDirStr = lastDirStr
            prompt.innerText += "\nERROR:";
            text.innerText += `\nThe directory '${currentDirStr}' does not exist`
        }
        return;
    }
    else if (element == "..")
    {
        currentDirStr = currentDirStr.split("/").slice(0, -1).join("/")
    }
    else
    {
        currentDirStr += `/${element}`
    }
    str = str.split("/").slice(1).join("/")
    loadDirectoryFromString(str)
}

window.addEventListener("keydown", function(event){
    if (event.key == "Enter"){
        let unfiltered = text.innerText.split("\n").slice(-1)[0].split(" ");
        let command = unfiltered[0];
        let information = unfiltered.splice(1);
        commandSorter(command, information);
        text.innerText += "\n";
        prompt.innerText += "\nnull@null:~$";
    } else if (event.key == "Shift" || event.key == "Control" || event.key == "Undefined" ){

    } else if (event.key == "Backspace") {
        if (text.innerText.split("\n").slice(-1)[0].split(" ") != "")
        {
            text.innerText = text.innerText.slice(0, -1)
        }
    } else {
        text.innerText += event.key;
    }
})

function commandSorter(callback, information)
{
    try
    {
        window[callback](information);
    }
    catch(err)
    {
        prompt.innerText += "\nERROR:";
        text.innerText += `\n"${callback}" could not be found or syntax was not used properly`;
        //console.log(err)
    }
}

//COMMANDS

function cd(info){
    info = info.join(" ");
    lastDir = currentDir;
    lastDirStr = currentDirStr;
    loadDirectoryFromString(info)
}

function echo(info)
{
    info = info.join(" ");
    prompt.innerText += "\n";
    text.innerText += `\n${info}`;
}

function help(command)
{
    if (command != "")
    {
        //console.log("not empty")

    } else {
        //console.log("empty")
        prompt.innerText += "\nCommands:"
        text.innerText += "\n"
        Object.keys(commands).forEach(element => {
            prompt.innerText += "\n"
            text.innerText += `\n${element}`
        });
        
    }
}

function test(lol){console.log(lol)}

function ls()
{
    prompt.innerText += "\nDirectory:"
    text.innerText += "\n"
    Object.keys(currentDir).forEach(element => {
        prompt.innerText += "\n"
        text.innerText += `\n${element}`   
    });
}

function mkdir(name)
{
    if (currentDir[name] == undefined)
    {
        currentDir[name] = {};
    }
    else
    {
        prompt.innerText += "\nERROR:";
        text.innerText += `\nThe directory '${name}' already exists!`;
    }
}

function open(name)
{
    //wip

}