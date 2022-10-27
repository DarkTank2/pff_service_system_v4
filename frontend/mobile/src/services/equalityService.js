class EqualityChecker {
  constructor () {
    this.checks = []
  }

  addCheck (cb) {
    // simple callback for simple properties
    this.checks.push({ cb })
    return this
  }
  addLinkedChecker (cb, checker) {
    // link to another checker, callback shall return an object the passed checker is designed for
    this.checks.push({ cb, checker })
    return this
  }
  addArrayCheck (arrayCb, checker) {
    // callback now returns an array of objects, the checker must fit the objects in the array
    this.checks.push({ arrayCb, checker })
    return this
  }
  addForeignKeyChecker (fkCb, checker, data1, data2, key) {
    // callback return the foreign key to check against in both data-arrays, check with the checker
    this.checks.push({ fkCb, checker, blob: { data1, data2, key } })
    return this
  }

  compare (obj1, obj2) {
    return this.checks.every(({ cb, arrayCb, checker, fkCb, blob }) => {
      if (checker && cb) {
        // check the objects with the passed checker
        return checker.compare(cb(obj1), cb(obj2))
      } else if (checker && arrayCb) {
        // two types of checks need to be done here
        // the first one is to check wether all entries from the first fit the second array
        // the second check is vice versa, only if both checks are successful, return true
        let bool1 = arrayCb(obj1).every(val1 => {
          return arrayCb(obj2).some(val2 => checker.compare(val1, val2))
        })
        let bool2 = arrayCb(obj2).every(val2 => {
          return arrayCb(obj1).some(val1 => checker.compare(val2, val1))
        })
        let bool3 = (arrayCb(obj1).length === arrayCb(obj2).length)
        return (bool1 && bool2 && bool3)
      } else if (fkCb && checker && blob) {
        const { data1, data2, key } = blob
        let val1 = data1.find(e => e[key] === fkCb(obj1))
        let val2 = data2.find(e => e[key] === fkCb(obj2))
        return checker.compare(val1, val2)
      } else {
        // default using callback to compare plain property
        return cb(obj1) === cb(obj2)
      }
    })
  }
}

export { EqualityChecker }
