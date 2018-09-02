Date.prototype.toLogTimeString = function () {
    return  this.getFullYear().toString().padStart(4, 0) + "-" + 
            (this.getMonth() + 1).toString().padStart(2, "0") + "-" + 
            this.getDate().toString().padStart(2, "0") + " " +
            this.getHours().toString().padStart(2, "0") + ":" + 
            this.getMinutes().toString().padStart(2, "0") + ":" + 
            this.getSeconds().toString().padStart(2, "0") + ":" + 
            this.getMilliseconds().toString().padStart(3, "0")
}

let date = new Date()
console.log(date.toLocaleDateString())