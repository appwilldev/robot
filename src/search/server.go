// server
package search

import (
    "io"
    "log"
    "fmt"
    "time"
    "errors"
    "net/http"
    "io/ioutil"
    "compress/gzip"
    "github.com/qiniu/iconv"
)

var _code, _err = iconv.Open("UTF-8", "GBK")
var ErrDecodeBuf = errors.New("Decode: bytes for decode is to long")


// do decode 
// global from GBK to UTF-8
func decode(data []byte) ([]byte, error) {
    buf := make([]byte, int(float32(len(data)) * 1.1))
    fmt.Printf("%d\n", len(buf))
    // if error occured, return data itself
    data, _, _ = _code.Conv(data, buf)
    return data, nil
}


// html parse
func parse(data []byte) error {


    return nil
}


// do real search
func crawl(text string) {
    var (
        req *http.Request
        resp *http.Response
        err error
        data []byte
    )
    url := fmt.Sprintf("http://www.v3gp.com/search.php?q=%s", text)
    client := &http.Client{}
    var timeDelay time.Duration = 0
    for {
        req, err = http.NewRequest("GET", url, nil)
        req.Header.Add("User_Agent", "AnyRingTone/1.1 CFNetwork/609.1.4 Darwin/13.0.0")
        req.Header.Add("Host", "www.v3gp.com")
        req.Header.Add("Accept-Encoding", "gzip")
        req.Header.Add("Accept", "*/*")
        req.Header.Add("Accept-Languate", "zh-cn")
        req.Header.Add("Connection", "keep-alive")
        resp, err = client.Do(req)
        if err != nil {
            // network request error
            log.Print(err)
            if timeDelay == 0 {
                timeDelay = 5 * time.Millisecond
            } else {
                timeDelay *= 2
            }
            time.Sleep(timeDelay)
            continue
        }
        break
    }
    // request ok
    defer resp.Body.Close()
    var reader io.ReadCloser
    switch resp.Header.Get("Content-Encoding") {
    case "gzip":
        log.Println("gzip")
        reader, err = gzip.NewReader(resp.Body)
        if err != nil {
            log.Println("Gzip Decode Failed")
            return
        }
        defer reader.Close()
    default:
        reader = resp.Body
    }
    data, err = ioutil.ReadAll(reader)
    // decode to utf8

    log.Printf("%d", len(data))
    data, err = decode(data)
    log.Printf("%d", len(data))
}

// search engine
// here load some search engines
func engine(resp http.ResponseWriter, req *http.Request) {
    // do read and write
    req.ParseForm()
    log.Println(req)
    if req.Method != "GET" {
        return
    }
    go crawl("because of you")
}


func Server (host string) {
    if _err != nil {
        log.Fatal("Code Convert Init Failed", _err)
    }
    defer _code.Close()

    http.HandleFunc("/", engine)
    err := http.ListenAndServe(host, nil)
    if err != nil {
        log.Fatal("Http Server Start Error: ", err)
    }
}
