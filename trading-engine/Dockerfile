FROM golang:1.19-buster

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . ./

RUN go build -o start-engine main.go

CMD ["./start-engine"]