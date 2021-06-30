# 每天一个命令行

### 2019-04-08

```shell
npm list [-g] --depth 0
```

查看[全局]安装的 npm 包，depth 0 表示查看最外层的包，depth 1 展开一层看看这些模块各自又依赖了哪些模块，以此类推。

### 2019-04-09

```shell
git branch -d <branch-name>
```

删除本地分支

```shell
git branch -b <branch-name>
```

新建本地分支

### 2019-04-10

```shell
echo "xxx" > file-name.txt
```

将内容"xxx"写入 file-name.txt 文件中，覆盖写入。

```shell
echo "xxx" >> file-name.txt
```

将内容"xxx"写入 file-name.txt 文件中，追加写入，echo 自动加换行。

### 2019-04-11

```shell
git checkout <origin-branch-name>
```

基于远端分支在本地新建同名分支。

### 2019-04-12

```shell
git rm -r --cached .
```

将所有文件从版本库里移除，-r 表示递归，深入文件内部。

之后再运行`git add .`和`git commit`后，新的.gitignore 规则就会生效。

### 2019-04-13

```shell
history
```

显示终端中运行过的命令。

### 2019-04-15

```shell
touch file-name
```

touch 命令用于修改文件或者目录的时间属性，包括存取时间和更改时间，若文件不存在，系统会建立一个新的文件。

也就是说该命令将文件的最后更改时间设置为系统当前时间。

### 2019-04-21

```shell
kill -9 PID
```

结束指定 PID 的进程，mac 可以打开活动监视器查看进程 PID。

### 2019-04-23

```shell
git merge --squash another
```

将 another 分支上的多个 commit 合并成一个，放在当前分支上，原来的 commit 历史则没有拿过来，需要填写一个 commite 记录。

### 2019-05-15

```shell
ls -l
```

列出文件夹内的文件信息。

### 2019-05-19

```shell
pwd
```

显示当前目录路径。

### 2019-05-23

```shell
git tag <tagname> [commit id]
```

创建一个标签，默认为 HEAD，可以指定一个 commit id。

```shell
git tag -a <tagname> -m "blablabla..."
```

创建一个带有信息的标签。

### 2019-05-27

```shell
git tag -d <tagname>
```

在本地删除一个标签。

```shell
git push origin :refs/tags/<tagname>
```

这样可以删除远程的标签（需要先在本地删除再删远程）。

### 2019-05-28

```shell
lsof -i tcp:<端口号>
```

查询端口号的占用情况，会显示出 PID，方便 kill。

### 2019-06-17

```shell
git push origin <xx> -f
```

reset --hard 版本回退后，只是本地回退。push 的时候加-f 参数，将远端代码也进行回退。不加参数 push 不了。

### 2019-07-08

```shell
git checkout origin/<xx> -b <xx>
```

基于远程的 xx 分支新建本地分支 xx。

### 2019-09-09

```shell
git reset --soft HEAD^
```

撤销上次 commit，不撤销 add .

### 2021-06-09

```shell
git cherry-pick
```

你需要另一个分支的所有代码变动，那么就采用合并（git merge）。另一种情况是，你只需要部分代码变动（某几个提交），这时可以采用 Cherry pick。

```shell
git cherry-pick <commitHash>
```

上面命令就会将指定的提交 commitHash，应用于当前分支。这会在当前分支产生一个新的提交，当然它们的哈希值会不一样。

### 2021-06-30

```shell
# 删除 untracked files
git clean -f

# 连 untracked 的目录也一起删掉
git clean -fd

# 连 gitignore 的 untrack 文件/目录也一起删掉 （慎用，一般这个是用来删掉编译出来的 .o之类的文件用的）
git clean -xfd

# 在用上述 git clean 前，墙裂建议加上 -n 参数来先看看会删掉哪些文件，防止重要文件被误删
git clean -nxfd
git clean -nf
git clean -nfd

# 撤销 add .
git reset
```
