const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// GET endpoint
app.get('/api/fnGet', (req, res) => {
	const filePath = path.join(__dirname, 'files', `users.txt`)
	let resp = []
	if (fs.existsSync(filePath)) {
    const oldContent = fs.readFileSync(filePath, 'utf8')
		let dataArray = oldContent.split('\n').map(line => line.split('|'))
		dataArray = dataArray.map((arr) => {
			return {lineid: (arr[0] || ''), linename: (arr[1] || ''), linepic: (arr[2] || ''), linestatus: (arr[3] || ''), gifttolineid: (arr[4] || ''), status: (arr[5] || '')}
		})

		resp = dataArray
  }

  const responseMessage = {
    message: 'success',
    data: resp
  };
  res.status(200).json(responseMessage);
});

// POST endpoint
app.post('/api/fnPost', (req, res) => {
  const param = req.body || {}
	const isreact = param.isreact || ''

	if (isreact == 'userstatus') {
		fnSetUserStatus(param)
	} else if (isreact == 'randomuser') {
		fnSetRandomUser()
	} else if (isreact == 'clear') {
		fnSetClear()
	}

  const responseMessage = {
    status: 'Success',
    data: param
  };

  res.status(200).json(responseMessage);
});
// lineid|linename|linepic|linestatus|gifttolineid|status
const fnSetUserStatus = (param) => {
	const filePath = path.join(__dirname, 'files', `users.txt`)
  if (fs.existsSync(filePath)) {
    const oldContent = fs.readFileSync(filePath, 'utf8')
		let dataArray = oldContent.split('\n').map(line => line.split('|'))
		let check = dataArray.filter((arr) => arr[0] == param.lineid)
		if (check.length) {
			dataArray = dataArray.map((arr) => {
				if (arr[0] == param.lineid) {
					return [(param.lineid || ''),(param.linename || ''),(param.linepic || ''),(param.linestatus || ''),(param.gifttolineid || ''),(param.status || '')]
				} else {
					return arr
				}
			})
		} else {
			dataArray.push([(param.lineid || ''),(param.linename || ''),(param.linepic || ''),(param.linestatus || ''),(param.gifttolineid || ''),(param.status || '')])
		}

		let fileContent = dataArray.map((arr) => {
			return arr.join('|')
		}).join('\n')

		fs.writeFileSync(filePath, fileContent, 'utf8')
  }
}
const fnSetRandomUser = () => {
	const filePath = path.join(__dirname, 'files', `users.txt`)
	if (fs.existsSync(filePath)) {
    const oldContent = fs.readFileSync(filePath, 'utf8')
		let dataArray = oldContent.split('\n').map(line => line.split('|'))

		const arr1 = dataArray.map((arr) => { return arr[0] })
		let arr3 = []
		let jsonarr = arr1.map((item) => {
			let random = Math.floor(Math.random() * arr1.filter((itemfilter) => arr3.indexOf(itemfilter) == -1 && itemfilter != item).length)
				let giftto = arr1.filter((itemfilter) => arr3.indexOf(itemfilter) == -1 && itemfilter != item)[random]
				arr3.push(giftto)
				return {lineid: item, giftto: giftto}
		})

		let fileContent = dataArray.map((arr) => {
			arr[4] = jsonarr.filter((item) => item.lineid == arr[0]).map((item) => { return item.giftto })[0]
			return arr.join('|')
		}).join('\n')

		fs.writeFileSync(filePath, fileContent, 'utf8')
  }
}
const fnSetClear = () => {
	const filePath = path.join(__dirname, 'files', `users.txt`)
  if (fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, '', 'utf8')
  }
}



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});