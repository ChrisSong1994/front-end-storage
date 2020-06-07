// getBoundingClientRect 实现懒加载
let imgList1 = [...document.querySelectorAll(".get_bounding_rect")]
let num = imgList1.length

let lazyLoad = (function () {
  let count = 0
  return () => {
    let deleteIndexList = []
    imgList1.forEach((img, index) => {
      const rect = img.getBoundingClientRect()
      if (rect.top < window.innerHeight) {
        img.src = img.dataset.src
        deleteIndexList.push(index)
        count++
      }
      if (count === num) {
        document.removeEventListener('scroll', lazyLoad)
      }
    })
    imgList1 = imgList1.filter((_, index) => {
      deleteIndexList.includes(index)
    })
  }
})()

// 这里引用了 throttle.js 的节流函数
lazyLoad = throttleProxy(lazyLoad, 100)
document.addEventListener('scroll', lazyLoad)
lazyLoad()