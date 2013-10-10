/*
 *
 */

package main

import (
    "fmt"
    "server"
)






func main() {
    fmt.Println("Server started")
    server.Master("127.0.0.1:9101")
    fmt.Println("Server exit")
}
