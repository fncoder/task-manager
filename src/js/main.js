var current = [];
var tasks = [];
var nextID = 0;

function Dashboard(){
  this.globalState = false;
  this.messages = ['Create new card', 'Delete card', 'Changes saved', 'All fields are required', 'Fullscreen mode is active'];
  this.theme = {
    basic: '#3798DC',
    dark: '#212121'
  }
  this.area = {
    main: document.querySelector('.main-content'),
    container: document.querySelector('.content-area'),
    message: document.querySelector('.message'),
    creator: document.querySelector('.creator'),
    sidebarLeft: document.querySelector('.sidebar-left')
  }
  this.sidebar = {
    title: document.querySelector('.input--title'),
    content: document.querySelector('.input--content'),
    author: document.querySelector('.input--author')
  }
  this.buttons = {
    submit: document.querySelector('.btn-submit')
  }
  this.switch = document.querySelector('.input-switch');
  this.toggle = document.querySelector('.switch-bar');
  this.settings = document.querySelector('.settings');
};

Dashboard.prototype.validate = function(){
  if(!this.globalState){
    var data = {};
    for(var key in this.sidebar){
      if(this.sidebar.hasOwnProperty(key) && this.sidebar[key].value){
        data[key] = this.sidebar[key].value;
      }

      else{
        this.log('All fields are required');
        return false;
      }
    }
    new Task(JSON.stringify(data));
  }
}

Dashboard.prototype.removeFields = function(){
  for(var key in this.sidebar){
    if(this.sidebar.hasOwnProperty(key)){
      this.sidebar[key].value = '';
    }
  }
}

Dashboard.prototype.toggleTheme = function(e){
  if(!this.globalState){
    if(!this.switch.checked){
      this.area.main.style.backgroundColor = this.theme.basic;
    }
    else{
      this.area.main.style.backgroundColor = this.theme.dark;
    }

    this.toggleKeyCode = false;

    if(e.keyCode){
      if(!this.toggleKeyCode && this.switch.checked){
        this.area.main.style.backgroundColor = this.theme.basic;
      }
      else{
        this.area.main.style.backgroundColor = this.theme.dark;
      }
      this.switch.checked = !this.switch.checked;
      this.toggleKeyCode = !this.toggleKeyCode;
    }
  }
}

Dashboard.prototype.toggleSidebar = function(e, element, direction){
  if(!this.globalState){
    e.preventDefault();
    if(e.keyCode !== 120){
    element.classList.toggle('sidebar-'+direction+'-toggle');
      if(!element.classList.contains('sidebar-'+direction+'-toggle')){
        element.classList.remove('sidebar-'+direction+'-toggle');
      }

      else{
        element.classList.add('sidebar-'+direction+'-toggle');
      }
    }

    else{
      element.classList.toggle('sidebar-'+direction+'-toggle');
    }
  }
}
Dashboard.prototype.log = function(message){
  for(let i=0; i < this.messages.length; i++){
    if(this.messages.indexOf(message) === i){
      this.area.message.classList.add('animate-msg');
      this.area.message.textContent = this.messages[i];
    }
  }
  setTimeout(function(){
    this.area.message.classList.remove('animate-msg');
  }.bind(this), 3000);
}

Dashboard.prototype.toggleFullscreen = function(element){
  if(!document.fullscreenElement || !document.mozFullScreenElement || !document.webkitFullscreenElement || !document.msFullscreenElement){
    if(element.requestFullscreen) {
       element.requestFullscreen();
     } else if(element.mozRequestFullScreen) {
       element.mozRequestFullScreen();
     } else if(element.webkitRequestFullscreen) {
       element.webkitRequestFullscreen();
     } else if(element.msRequestFullscreen) {
       element.msRequestFullscreen();
     }
  }

  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  else if(document.msExitFullscreen) {
   document.msExitFullscreen();
  }

}
Dashboard.prototype.init = function(){
var self = this;
  this.buttons.submit.addEventListener('click', function(e){
    e.preventDefault();
    self.validate();
  })
  this.switch.addEventListener('click', this.toggleTheme.bind(this));
  document.addEventListener('keydown', function(e){
    if(e.keyCode === 113){
      self.toggleFullscreen(document.querySelector('body'));
    }

    if(e.keyCode === 115){
      self.toggleTheme(e);
    }

    if(e.keyCode === 119){
      self.toggleSidebar(e, self.area.sidebarLeft, 'left');
    }

    if(e.keyCode === 120){
      self.toggleSidebar(e, self.area.creator, 'right');
    }
  });

  this.settings.addEventListener('click', function(e){
    self.toggleSidebar(e, self.area.sidebarLeft, 'left');
  });
}

function Task(data){
  Dashboard.call(this);
  this.id = nextID++;
  this.posX = 0;
  this.posY = 0;
  this.resizeX = 0;
  this.resizeY = 0;
  this.encodeData = JSON.parse(data);
  this.onDrag = this.draggable.bind(this);
  this.onResize = this.resize.bind(this);
  this.activeText = null;
  this.currentText = null;
  this.editArea = false;
  this.activeArea = true;
  this.escape = false;
  this.saveStr = [];
  this.single = {
    article: document.createElement('article'),
    header: document.createElement('header'),
    h: document.createElement('h2'),
    hText: document.createTextNode(''),
    paragraph: document.createElement('p'),
    paragraphText: document.createTextNode(''),
    author: document.createElement('p'),
    authorText: document.createTextNode(''),
    edit: document.createElement('span'),
    resize: document.createElement('div')
  }
  this.inputs = {
    title: document.createElement('h2'),
    content: document.createElement('p'),
    author: document.createElement('p')
  }

  tasks.push(this);
  current.push(this.id);
  this.removeFields();
  this.init();
}


Task.prototype = Object.create(Dashboard.prototype);
Task.prototype.constructor = Task;

Task.prototype.create = function(){
  this.single.article.classList.add('task');
  this.single.article.classList.add('task' + this.id);

  this.single.article.appendChild(this.single.edit);
  this.single.article.appendChild(this.single.header);
  this.single.article.appendChild(this.inputs.content);
  this.single.article.appendChild(this.inputs.author);
  this.single.article.appendChild(this.single.resize);
  this.single.header.appendChild(this.inputs.title);

  this.single.resize.classList.add('resize');
  this.single.edit.classList.add('icon-edit');
  this.single.header.classList.add('task-header');
  this.inputs.title.classList.add('task-header__title')
  this.inputs.content.classList.add('task__text')
  this.inputs.author.classList.add('task__author')

  this.inputs.title.appendChild(this.single.hText);
  this.inputs.title.appendChild(document.createElement('span'));

  this.inputs.content.appendChild(this.single.paragraphText);
  this.inputs.content.appendChild(document.createElement('span'));

  this.inputs.author.appendChild(this.single.authorText);
  this.inputs.author.appendChild(document.createElement('span'));

  this.single.hText.textContent = this.encodeData.title;
  this.single.paragraphText.textContent = this.encodeData.content
  this.single.authorText.textContent = this.encodeData.author

  this.area.container.appendChild(this.single.article);

  this.log('Create new card');
}

Task.prototype.pressedMouse = function(e){
  if(e.target !== this.single.edit){
    this.posX = e.clientX - this.single.article.offsetLeft;
    this.posY = e.clientY - this.single.article.offsetTop

    this.edit(e);
    document.addEventListener('mousemove', this.onDrag);
  }

  if(e.target === this.single.resize){
    this.resizeX = e.clientX - this.single.article.clientWidth;
    this.resizeY = e.clientY - this.single.article.clientHeight;

    document.removeEventListener('mousemove', this.onDrag);
    document.addEventListener('mousemove', this.onResize)
  }

  if(e.target === this.single.edit){
    this.editArea = !this.editArea;
    this.edit(e);
    this.currentID(e);
  }
}

Task.prototype.mouseUp = function(){
  document.removeEventListener('mousemove', this.onDrag);
  document.removeEventListener('mousemove', this.onResize);
}

Task.prototype.draggable = function(e){
  var currentPosX =  e.clientX - this.posX;
  var currentPosY =  e.clientY - this.posY;

  var maxWidthArea = this.area.container.clientWidth - this.single.article.clientWidth;
  var maxHeightArea = this.area.container.clientHeight - this.single.article.clientHeight;

  if(currentPosX >= maxWidthArea){
    currentPosX = maxWidthArea;
  }

    if(currentPosY >= maxHeightArea){
      currentPosY = maxHeightArea;
    }

      if(currentPosX < 0 ){
          currentPosX = 0;
      }

      if(currentPosY < 0){
        currentPosY = 0;
      }

  this.single.article.style.left =  currentPosX + 'px';
  this.single.article.style.top = currentPosY + 'px';
}

Task.prototype.resize = function(e){

  var maxWidthResize = this.area.container.clientWidth - this.single.article.offsetLeft;
  var maxHeightResize = this.area.container.clientHeight - this.single.article.offsetTop;

  var resizeX = e.clientX - this.resizeX;
  var resizeY = e.clientY - this.resizeY;

  var widthResize = 150;


  if(resizeX >= maxWidthResize){
    resizeX = maxWidthResize;
  }

    if(resizeX <= widthResize){
      resizeX = widthResize;
    }

      if (resizeY >= maxHeightResize) {
        resizeY = maxHeightResize;
      }

  this.single.article.style.width = resizeX + 'px';
  this.single.article.style.minHeight = resizeY + 'px';
}

Task.prototype.edit = function(e){
  if(this.editArea){
    for(var key in this.inputs){
      if(this.inputs[key] === this.inputs.title && this.activeArea){
        this.currentNode = this.inputs[key].childNodes;
        this.currentNode[1].classList.add('index');
      }
      ////Unsave string event
      if(e.keyCode === 27){
        this.inputs[key].childNodes[0].nodeValue = this.encodeData[key];
        this.currentNode[1].classList.remove('index');

        this.editArea = false;
        this.activeArea = true;
      }

      else if (this.inputs[key] === e.target){
        this.currentNode[1].classList.remove('index');
        this.currentNode = this.inputs[key].childNodes;

        this.currentNode[1].classList.add('index');
        this.activeArea = false;
      }
    }
      ////Remove string event
      if(e.keyCode === 8){
        var sliceText = this.currentNode[0].textContent.slice(0, this.currentNode[0].textContent.length - 1);
        this.currentNode[0].textContent = sliceText;
      }

      ////Save string event
      else if(e.keyCode === 13){
        this.currentNode[1].classList.remove('index');
          for(var keyData in this.encodeData){
            this.encodeData[keyData] = this.inputs[keyData].textContent;
          }
        this.log('Changes saved');
        this.editArea = false;
        this.activeArea = true;
      }

      ////Add string event
      else if (e.keyCode){
        var specialChar = ['Escape','CapsLock','Tab','ShiftLeft','ShiftRight','AltLeft','AltRight','ControlLeft','ControlRight','ArrowUp','ArrowLeft','ArrowRight','ArrowDown'];
        if(specialChar.indexOf(e.code) === -1){
          this.currentNode[0].textContent += e.key;
        }
      }
  }

  else{
    if(!this.escape){
      for(var key in this.inputs){
        this.inputs[key].childNodes[0].nodeValue = this.encodeData[key];
      }
    }

    for(var key in this.inputs){
      this.inputs[key].childNodes[1].classList.remove('index');
    }
    this.activeArea = true;
  }
}

Task.prototype.currentID = function(e){
var self = this;
  current.forEach(function(value,index){
    if(e.target === self.single.edit){
      if(value === self.id){
        return false;
      }
      else{
        for(var key in tasks[index].inputs){
          tasks[index].inputs[key].childNodes[0].nodeValue = tasks[index].encodeData[key];
        }

        tasks[index].editArea = false;
        tasks[index].edit();
      }
    }
  });
}

Task.prototype.init = function(){
  this.create();
  this.single.article.addEventListener('mousedown', this.pressedMouse.bind(this));
  document.addEventListener('mouseup', this.mouseUp.bind(this));
  document.addEventListener('keydown', this.edit.bind(this));
}

window.addEventListener('load', function(){
  var dashboard = new Dashboard();
  dashboard.init();
})
