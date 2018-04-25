function MonetizerClient (opts) {
  this.url = (opts && opts.url) || window.location.origin
  this.cookieName = (opts && opts.cookieName) || '__monetizer'
  this.receiverEndpointUrl = (opts && opts.receiverEndpointUrl) || '/__monetizer/:id'
  this.receiverUrl = this.url + this.receiverEndpointUrl
  const COOKIE_REGEX = new RegExp(this.cookieName + '=(.*?)(;|$)')
  this.getMonetizationId = function () {
    const match = document.cookie.match(COOKIE_REGEX)
    if (!match) {
      throw new Error('No match found for cookie!')
    }

    return match[1]
  }

  this.start = function () {
    const id = this.getMonetizationId()

    return new Promise((resolve, reject) => {
      if (document.readyState !== 'complete') {
        document.addEventListener('readystatechange', event => {
          this.start(id)
            .then(resolve)
        })
        return
      }

      const receiverUrl = this.receiverUrl.replace(':id', id)
      if (window.monetize) {
        window.monetize({
          receiver: receiverUrl
        })
        resolve(id)
      } else {
        console.log('Your extension is disabled or not installed.' +
          ' Manually pay to ' + this.receiverUrl)
        reject(new Error('web monetization is not enabled'))
      }
    })
  }
}
