// server
package server

import (
    "net"
    "time"
    "log"
)

func Master(host string) error {
    l, err := net.Listen("tcp", host)
    if err != nil {
        return err
    }
    defer l.Close()

    var tempDelay time.Duration // how long to sleep on accept falure
    for {
        rw, e := l.Accept()
        if e != nil {
            if ne, ok := e.(net.Error); ok && ne.Temporary() {
                if tempDelay == 0 {
                    tempDelay = 5 * time.Millisecond
                } else {
                    tempDelay *= 2
                }
                if max := 1 * time.Second; tempDelay > max {
                    tempDelay = max
                }
                time.Sleep(tempDelay)
                continue
            }
            return e
        }
        go Server(rw)
        tempDelay = 0
    }
}

func Server(client net.Conn) error {
    // do read and write
    log.Println("345")

    defer client.Close()
    return nil
}
