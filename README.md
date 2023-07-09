# quant-back

## 1.项目介绍

个人的毕业设计，一个采用 Electron + vue + elementUI + sqlLite 的一个用于给用户自己指定量化策略，并进行回测的系统，支持数据导入，策略编辑，回测， 结果展示功能.

## 2.开发环境

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 3.程序启动

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## 4.效果预览

### 4.1 回测模块的实现

回测模块主要用于进行策略回测，在该界面我们可以选择回测的策略，回测的类型，回测的时间等等配置，当回测完成之后已图表的方式展示回测结果，并展示每次交易的详情。回测开始前界面如图所示。

![image-20230709235309810](https://s1.ax1x.com/2023/07/10/pC2UKGd.png)

**回测历史管理**。回测历史管理中用户可以对回测策略记录进行删除等操作。效果如图所示。

![image-20230710000336568](https://s1.ax1x.com/2023/07/10/pC2UMRA.png)

**回测历史分析**。回测历史分析模块中可以对策略每次交易的买入卖出进行分析，可以观察策略的收益和大盘平均收益的差距。效果图如图所示。

![image-20230709235711082](https://s1.ax1x.com/2023/07/10/pC2UuPH.png)

点击交易表格记录，查看每次交易的买卖点效果如图所示。

![image-20230709235721259](https://s1.ax1x.com/2023/07/10/pC2UeaD.png)

### 4.2 策略编写模块的实现

策略编写模块主要用编写策略，在该模块中提供一个代码编辑器，可以用写 javaScript 的方式让用户编写自己的策略。顺带可以对编写好的策略进行修改，删除，等操作。策略编写模块界面图所示。

![image-20230709235733986](https://s1.ax1x.com/2023/07/10/pC2UmIe.png)

图 5.5 策略编写模块效果图

**代码编辑器。**会对用户输入的代码关键字进行提示和补全功能，支持 javaScript 语言的识别，代码关键字高亮显示，效果如图所示。

![](https://s1.ax1x.com/2023/07/10/pC2UQxI.png)

### 4.3 数据管理模块的实现

数据管理模块主要用于管理用于进行回测的数据，主要包含三大功能模块。

**数据来源管理。**用户可以从外部文件中导入相应的的数据用于支持后面的回测工作。其界面效果图所示。

![image-20230710000100880](https://s1.ax1x.com/2023/07/10/pC2U3sP.png)

**数据质量管理。**数据质量管理可以对导入的数据自动进行表头字段检查，格式化检查，自动获取文件代码信息。以确保导入数据正确可用。界面效果图如图所示。

![image-20230710000037872](https://s1.ax1x.com/2023/07/10/pC2U1Mt.png)

**数据储存管理。**数据储存管理中可以对导入的数据进行删除，等操作。并可以对数据进行展示，让用户可以选择数据的展示方式。效果如图所示。

![image-20230710000005572](https://s1.ax1x.com/2023/07/10/pC2U8qf.png)

数据展示效果图如图所示。

![image-20230709235952203](https://s1.ax1x.com/2023/07/10/pC2UJZ8.png)

### 4.4 首页模块的实现

首页模块主要用于展示系统总体的一些情况，可以显示当前交易的大盘实时行情数据。其效果如图所示。

![image-20230710000123382](https://s1.ax1x.com/2023/07/10/pC2UYdS.png)