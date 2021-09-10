- [git](#git)
  - [撤销工作区的修改](#撤销工作区的修改)
  - [撤销 commit](#撤销-commit)
  - [撤销 add .](#撤销-add-)
  - [撤销工作区的新建文件](#撤销工作区的新建文件)
  - [撤销 commit 后提交](#撤销-commit-后提交)
  - [撤销某次提交](#撤销某次提交)
  - [新建/删除本地分支](#新建删除本地分支)
  - [基于远端分支在本地新建同名分支](#基于远端分支在本地新建同名分支)
  - [将所有文件从版本库里移除](#将所有文件从版本库里移除)
  - [合并分支(不带分支提交记录)](#合并分支不带分支提交记录)
  - [部分提交合并分支](#部分提交合并分支)
- [npm](#npm)
  - [查看**全局**安装的 npm 包](#查看全局安装的-npm-包)
- [Linux](#linux)
  - [在文件中写入内容](#在文件中写入内容)
  - [显示终端中运行过的命令](#显示终端中运行过的命令)
  - [创建新文件](#创建新文件)
  - [结束进程](#结束进程)
  - [列出文件夹内的文件信息](#列出文件夹内的文件信息)
  - [显示当前目录路径](#显示当前目录路径)
  - [查询端口号的占用情况](#查询端口号的占用情况)

## git

### 撤销工作区的修改

```shell
git checkout -- <file>

git checkout .
```

### 撤销 commit

**reset 不加路径**撤销 commit

```shell
# 撤销 commit, 回退到上一次 commit, 保留工作区和暂存区的修改
git reset HEAD~1 --soft

# 撤销 commit, 回退到上一次 commit, 保留工作区的修改, 不保留暂存区的修改, 相当与回退到 add 前的状态
git reset HEAD~1

# 撤销 commit, 回退到上一次 commit, 不保留工作区和暂存区的修改
git reset HEAD~1 --hard
```

### 撤销 add .

**reset 加路径**将跳过撤销 commit

```shell
git reset HEAD <file>

git reset .
```

### 撤销工作区的新建文件

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

```

### 撤销 commit 后提交

```shell
git push origin <xx> -f
```

reset --hard 版本回退后，只是本地回退。push 的时候加-f 参数，将远端代码也进行回退。不加参数 push 不了。

### 撤销某次提交

```shell
git revert <commit id>
```

反做一个版本，以达到撤销该版本修改的目的。比如，我们 commit 了三个版本（版本一、版本二、 版本三），突然发现版本二不行（如：有 bug），想要撤销版本二，但又不想影响撤销版本三的提交，就可以用 git revert 命令来反做版本二，生成新的版本四，这个版本四里会保留版本三的东西，但撤销了版本二的东西。revert 是回滚某个 commit ，不是回滚“到”某个。

### 新建/删除本地分支

```shell
# 新建本地分支
git branch -b <branch-name>

# 删除本地分支
git branch -d <branch-name>
```

### 基于远端分支在本地新建同名分支

```shell
git pull

git checkout <origin-branch-name>
```

git pull 将远端仓库和本地仓库同步, 本地仓库有了远端新仓库的记录. 之后再 checkout

### 将所有文件从版本库里移除

```shell
git rm -r --cached .
```

将所有文件从版本库里移除，-r 表示递归，深入文件内部。

之后再运行`git add .`和`git commit`后，新的.gitignore 规则就会生效。

### 合并分支(不带分支提交记录)

```shell
git merge --squash another
```

将 another 分支上的多个 commit 合并成一个，放在当前分支上，原来的 commit 历史则没有拿过来，需要填写一个 commite 记录。

### 部分提交合并分支

```shell
git cherry-pick
```

你需要另一个分支的所有代码变动，那么就采用合并（git merge）。另一种情况是，你只需要部分代码变动（某几个提交），这时可以采用 Cherry pick。

```shell
git cherry-pick <commitHash>
```

上面命令就会将指定的提交 commitHash，应用于当前分支。这会在当前分支产生一个新的提交，当然它们的哈希值会不一样。

## npm

### 查看**全局**安装的 npm 包

```shell
npm list [-g] --depth 0
```

查看[全局]安装的 npm 包，depth 0 表示查看最外层的包，depth 1 展开一层看看这些模块各自又依赖了哪些模块，以此类推。

## Linux

### 在文件中写入内容

```shell
# 将内容"xxx"写入 file-name.txt 文件中，覆盖写入。
echo "xxx" > file-name.txt

# 将内容"xxx"写入 file-name.txt 文件中，追加写入，echo 自动加换行。
echo "xxx" >> file-name.txt
```

### 显示终端中运行过的命令

```shell
history
```

### 创建新文件

```shell
touch file-name
```

touch 命令用于修改文件或者目录的时间属性，包括存取时间和更改时间，若文件不存在，系统会建立一个新的文件。

也就是说该命令将文件的最后更改时间设置为系统当前时间。

### 结束进程

```shell
kill -9 PID
```

结束指定 PID 的进程，mac 可以打开活动监视器查看进程 PID。

### 列出文件夹内的文件信息

```shell
ls -l
```

### 显示当前目录路径

```shell
pwd
```

### 查询端口号的占用情况

```shell
lsof -i tcp:<端口号>
```

查询端口号的占用情况，会显示出 PID，方便 kill。
