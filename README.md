# Tron Full Node Setup Guide

This guide will walk you through the process of setting up a Tron Full Node on a machine with the recommended configuration.

## 1. Install Oracle JDK 1.8 and Git

### Installing Git

1. Update the local package index:
   ```bash
   sudo apt update
   ```

2. Install Git:
   ```bash
   sudo apt install git
   ```

### Installing Oracle JDK 1.8

1. Download the x64 Compressed Archive from [Oracle JDK Downloads](https://www.oracle.com/java/technologies/downloads/).

2. Create a directory for extraction:  For additional information, refer to the [Install Oracle JDK 1.8](https://linux.how2shout.com/how-to-install-oracle-java-8-64-bit-ubuntu-22-04-20-04-lts/).
   ```bash
   sudo mkdir java
   ```

3. Extract the archive:
   ```bash
   tar -xf file-name.tar.gz -C /full-path-to-extract-directory
   ```

4. Add the executable folder to the system PATH:
   ```bash
   echo 'export PATH="$PATH:/full-path-to-executable-folder"' >> ~/.bashrc
   ```

5. Reload the bash shell:
   ```bash
   source ~/.bashrc
   ```

6. Check the Java version:
   ```bash
   java -version
   ```

## 2. Obtain Fullnode.js

Clone the Tron GitHub repository and build FullNode.jar:

```bash
git clone https://github.com/tronprotocol/java-tron.git
cd java-tron
git checkout -t origin/master
./gradlew clean build -x test
```

You will find FullNode.jar under `./java-tron/build/libs/` if the build is successful.

## 3. Get the Mainnet Configure File

Download the mainnet configure file and rename it:

```bash
wget https://github.com/tronprotocol/tron-deployment/blob/master/main_net_config.conf?raw=true -O main_net_config.conf
```

## 4. Obtain FullNode Data Snapshot

Download the corresponding compressed backup database from http://52.77.31.45/. It will take about 2 days.

```bash
nohup wget http://52.77.31.45/backup20240122/FullNode_output-directory.tgz &
```

Decompress the backup database file to the output-directory. It will take about 12 hours.

## 5. Startup the Node

Start the Full Node with the following command:

```bash
nohup java -Xms9G -Xmx9G -XX:ReservedCodeCacheSize=256m \
            -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m \
            -XX:MaxDirectMemorySize=1G -XX:+PrintGCDetails \
            -XX:+PrintGCDateStamps -Xloggc:gc.log \
            -XX:+UseConcMarkSweepGC -XX:NewRatio=2 \
            -XX:+CMSScavengeBeforeRemark -XX:+ParallelRefProcEnabled \
            -XX:+HeapDumpOnOutOfMemoryError \
            -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=70 \
            -jar FullNode.jar -c main_net_config.conf -d /full-path-to-output-directory >> start.log 2>&1 &
```

Replace `/full-path-to-output-directory` with the actual path to your output directory.

This script assumes that the node reads the output-directory by default. If you need to specify another directory, add the `-d directory` parameter when starting the node.

For additional information, refer to the [Install Oracle JDK 1.8](https://linux.how2shout.com/how-to-install-oracle-java-8-64-bit-ubuntu-22-04-20-04-lts/).