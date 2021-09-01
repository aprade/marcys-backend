# get all machines
GET /machines

### response schema

```json
{
	"message": string,
	"status_code": number,
	"machines": [
		{
			"id": number,
			"ip": string,
			"nickname": string
		}
	]
}
```

# create an item
POST /machines

### input schema

```json
{
	"ip": string,
	"nickname": string
}
```

### response schema

```json
{
	"message": string,
	"status_code": number,
	"machine": {
		"id": number,
		"ip": string,
		"nickname": string,
		"status": string
	}
}
```


# update a machine using an id parameter
PUT /machines/:id

# delete a machine using an id parameter
DELETE /machines/:id