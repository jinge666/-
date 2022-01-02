const fs = require('fs')
const path = require('path')

console.clear()

let destinationFolder = process.argv[2]  //获取目标文件夹
let classificationDir = process.argv[3] ? './' + process.argv[3] : "./整理过后的文件夹" //整理过后文件夹的名称
let filePath = path.join(__dirname,destinationFolder)
let parentPath = []   //多级问价夹时存储父级文件夹

// 获取目标文件夹中的所有文件
function getFiles (filePath) {
  creatClassificationDir (classificationDir)
  fs.readdir(filePath,{withFileTypes:true},(err,files) => {
    if(err) {
      console.log(err);
      return
    }
    files.forEach(item => {
      if(item.isDirectory()) {
        let dirPath = path.resolve(filePath,item.name)
        parentPath.push(item.name)
        getFiles(dirPath)
      }else{
        let extIndex = item.name.lastIndexOf('.')
        let ext = item.name.substring(extIndex + 1)
        let childrenPath = path.join('./',classificationDir,ext)
        // 创建一个个单独文件夹存放分类文件
        creatClassificationDir(childrenPath)
        let srcPath = path.resolve(destinationFolder,parentPath.join('/'),item.name)  //文件所在
        let destPath = path.resolve(childrenPath,item.name) //目标文件夹
        copeFile(srcPath,destPath)
        parentPath = []
      }
    })
  })
}
// 创建整理后的文件夹
function creatClassificationDir (classificationDir) {
  if(!fs.existsSync(classificationDir)) {
    // 创建文件夹
    fs.mkdirSync(classificationDir,err => {
      console.log(err);
    })
  }
}
// 复制文件
function copeFile (src,dest) {
  if(!fs.existsSync(dest)) {
    fs.copyFileSync(src,dest)
  }
}

getFiles(filePath)