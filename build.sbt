import play.Project._

name := """triv.me"""

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  javaCore,
  "org.webjars" %% "webjars-play" % "2.2.2"
)

requireJs += "main.js"

requireJsShim += "main.js"

playJavaSettings
