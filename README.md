# cabinet
封装的一款基于jQuery的机柜组件

## 机柜组件使用说明

### 目录说明

- cabinet：组件的根目录
  - img：图片文件夹
  - lib：引入的其他库（jQuery）
  - cabinet.js：组件的主文件
  - cabinet：组件的样式文件

### 调用

- 引入机柜组件

  ```html
  <script src="cabinet/lib/jquery.js"></script>
  <script src="cabinet/cabinet.js"></script>
  ```

- 创建机柜对象

  1. 首先需要有一个存放机柜的容器

     ```html
     <div id="testDiv"></div>
     ```

  2. 调用机柜组件

     ```js
     cabinet({
       	//容器的id，必填
         id:'testDiv',
       	//希望创建的机柜的宽度
         width: 220,
       	//希望创建的机柜的U数
         unit: 20,
       	//希望创建的机柜每一U的高度
         height: 30,
       	//是否需要U数提示（0不需要，1需要）
         unitNumShow:1
     }
     ```

### 事件

- 点击事件：点击机柜时触发

  ```js
  //e为点击的div，通过e.target可以拿到div的各项参数
  cabMethod.cabClick = function(e){
      //点击时需要做的事
  }
  ```

- 放置事件：将拖拽物放入机柜时触发

  ```js
  //e为放入的div容器，通过e.target可以拿到div的各项参数
  cabMethod.cabDrop = function(e){
      //点击时需要做的事
  }
  ```

### 方法

- 添加设备

  ```js
  /**
   * 添加设备
   * @param e 添加的容器的信息
   * @param dev 添加的设备的信息
   */
  cabMethod.addDevice(e,dev);

  //dev参数的内容及格式如下
  dev = {
    	//背景图片的地址
      url："",
    	//设备需要占据的空间，以U为单位，例如占1U的设备高和宽都为1
    	size:{height:"",width:""},
    	//设备的其它信息
    	//todo：暂时还没定好
  }
  ```

- 删除设备（待开发）

  ```js
  cabMethod.removeDevice
  ```

- 恢复机柜初始状态（添加中如取消或其他操作点击添加未成功时可调用此方法）

  ```js
  cabMethod.resetUnit(e)
  ```

- 刷新设备状态

  ```js
  /**
   * 刷新设备状态
   * @param id 机柜容器的id
   * @param dev 该机柜内所有设备的状态
   */
  cabMethod.refreshStatus(id, dev)

  //dev参数的内容及格式如下
  dev = {
    	//机柜的温度
      temp："",
    	//机柜的湿度
    	wetness:"",
    	//设备的其它信息
    	//todo：暂时还没定好
  }
  ```

 
