var login = "admin@kali:";
var homeDir = "/home/admin";
var path = "~$ ";
var loc = "/home/admin";
var error = false;
var t1 = new Terminal();
t1.setHeight("300px");
t1.setWidth('600px');
t1.fixOverflow();

document.body.appendChild(t1.html)

t1.print('This is a fake installation of Kali Linux')
t1.input(login+path, function (input) {
  processing(input);
})

function nextLine() {
  t1.input(login+path, function (input) {
     processing(input);
  })
}

function processing(input) {
  var cmd = removePathing(input);
  if (cmd.startsWith("ls")){//ls can be run without anything after it.
    processls(cmd)
  }
  else if (cmd.startsWith("cd")){
    processCd(cmd)
  }
  else{
    errored();
  }

  nextLine();
  t1.fixTextHeight();//update the scroll so the input is still at the bottom
}

function removePathing(input){
  var lengthTotal = login.length + path.length;
  return input.substring(lengthTotal);
}
/*
Fix so it only goes to places that exist (if includes changed dir)


*/
function processls(cmd){
  var dirArray = []
  if (cmd.startsWith("ls")){
    //check command list of correct commands()

    for (var i = 0;i < dirs.length;i++){
      if (dirs[i].startsWith(loc)){
        var current = dirs[i].substring(loc.length);
        var parts;
        parts = current.split("/");//
        if (loc == "/"){//used for root
          if (!dirArray.includes(parts[0]) && parts[0] != undefined){
            dirArray.push(parts[0]);
          }
        }
        else{
          if (!dirArray.includes(parts[1]) && parts[1] != undefined){
            dirArray.push(parts[1]);
          }
        }
      }
    }

    var output = "";
    for (var i = 0;i < dirArray.length;i++){
      output = output + dirArray[i] + " ";
    }
    t1.print(output);
  }
  else{
    errored();
  }
}

function processCd(cmd){
  if (cmd.startsWith("cd ")){
    var list = cmd.split(" ");
    var newDir = list[1];
    if(dirs.includes(newDir)){
      loc = newDir;
    }
    else if(newDir == ".."){
      if (loc != "/"){
        loc = goBackOne();
      }
    }
    else{
      var checkFailed = true;
      for (var i = 0;i < dirs.length;i++){
        if (dirs[i].startsWith(loc)){//check if the dirs element starts with the current location
          var current = dirs[i].substring(loc.length);
          var parts = current.split("/");
          if (current == newDir){
            loc = loc + newDir;
            checkFailed = false;
            break;
          }
          else if (parts[0] == newDir){
            loc = loc + newDir;
            checkFailed = false;
            break;
          }
          else if(current.substring(1) == newDir){
            loc = loc + "/" + newDir;
            checkFailed = false;
            break;
          }
        }
      }
      if (checkFailed){
        errored("No such file or directory");
      }
    }
  }
  else if (cmd === "cd"){
    loc = homeDir;
  }
  else{
    errored();
  }
  updatePath();
}

function updatePath(){
  if (loc == homeDir){
    path = "~$ ";
  }
  else {
    path = loc + "$ ";
  }
}

function errored(msg) {
  if (msg){
    t1.print(msg);
  }
  else{
    t1.print("Command not found")
  }
}

function goBackOne(path){//takes path and goes back one directory    /home/admin -> /home
  var parts = loc.split("/");
  var next = parts[parts.length-1];
  var endLen = next.length;
  var final = loc.substring(0,loc.length-endLen-1);
  if (final == ""){
    return "/";
  }else{
    return final;
  }
}
