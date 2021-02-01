#!/bin/sh
mkdir -p test-server
cd test-server

if [ -d "../target" ]; then
  mkdir -p plugins
  cp ../target/EmojiChat.jar plugins/EmojiChat.jar
else
  echo "You need to build EmojiChat first"
  exit 0
fi

if [ ! -f "plugins/LuckPerms.jar" ]; then
  wget https://ci.lucko.me/job/LuckPerms/1265/artifact/bukkit/build/libs/LuckPerms-Bukkit-5.2.99.jar -O plugins/LuckPerms.jar
fi

if [ ! -f "paper.jar" ]; then
  wget https://papermc.io/api/v2/projects/paper/versions/1.16.5/builds/457/downloads/paper-1.16.5-457.jar -O paper.jar
fi

echo "eula=true" >> eula.txt
echo "" >> eula.txt

java -jar paper.jar nogui
