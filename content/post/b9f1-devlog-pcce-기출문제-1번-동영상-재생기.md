---
publish: false
draft: true
title: PCCE 기출문제 1번 - 동영상 재생기
description: programmers, Java
author: Nine
date: 2026-02-14T10:00:00
categories:
  - 알고리즘
  - 프로그래머스
tags:
  - algorithms
  - programmers
  - lv1
  - 구현
  - 시뮬레이션
  - Java
id: 019ce76a-c2f2-73b4-8321-f400fb2db2fd
slug: b9f1-devlog-pcce-기출문제-1번-동영상-재생기
---

## 📌문제 설명

당신은 동영상 재생기를 만들고 있습니다. 당신의 동영상 재생기는 10초 전으로 이동, 10초 후로 이동, 오프닝 건너뛰기 3가지 기능을 지원합니다. 각 기능이 수행하는 작업은 다음과 같습니다.

* 10초 전으로 이동: 사용자가 "prev" 명령을 입력할 경우 동영상의 재생 위치를 현재 위치에서 10초 전으로 이동합니다. 현재 위치가 10초 미만인 경우 영상의 처음 위치로 이동합니다. 영상의 처음 위치는 0분 0초입니다.
* 10초 후로 이동: 사용자가 "next" 명령을 입력할 경우 동영상의 재생 위치를 현재 위치에서 10초 후로 이동합니다. 동영상의 남은 시간이 10초 미만일 경우 영상의 마지막 위치로 이동합니다. 영상의 마지막 위치는 동영상의 길이와 같습니다.
* 오프닝 건너뛰기: 현재 재생 위치가 오프닝 구간(`op_start` ≤ 현재 재생 위치 ≤ `op_end`)인 경우 자동으로 오프닝이 끝나는 위치로 이동합니다.

동영상의 길이를 나타내는 문자열 `video_len`, 기능이 수행되기 직전의 재생위치를 나타내는 문자열 `pos`, 오프닝 시작 시각을 나타내는 문자열 `op_start`, 오프닝이 끝나는 시각을 나타내는 문자열 `op_end`, 사용자의 입력을 나타내는 1차원 문자열 배열 `commands`가 매개변수로 주어집니다. 이때 사용자의 입력이 모두 끝난 후 동영상의 위치를 "`mm`:`ss`" 형식으로 return 하도록 solution 함수를 완성해 주세요.

## 📌제한사항

* `video_len`의 길이 = `pos`의 길이 = `op_start`의 길이 = `op_end`의 길이 = 5
  * `video_len`, `pos`, `op_start`, `op_end`는 "`mm`:`ss`" 형식으로 `mm`분 `ss`초를 나타냅니다.
  * 0 ≤ `mm` ≤ 59
  * 0 ≤ `ss` ≤ 59
  * 분, 초가 한 자리일 경우 0을 붙여 두 자리로 나타냅니다.
  * 비디오의 현재 위치 혹은 오프닝이 끝나는 시각이 동영상의 범위 밖인 경우는 주어지지 않습니다.
  * 오프닝이 시작하는 시각은 항상 오프닝이 끝나는 시각보다 전입니다.
* 1 ≤ `commands`의 길이 ≤ 100
  * `commands`의 원소는 "prev" 혹은 "next"입니다.
  * "prev"는 10초 전으로 이동하는 명령입니다.
  * "next"는 10초 후로 이동하는 명령입니다.

## 📌입출력 예

| video\_len | pos     | op\_start | op\_end | commands                  | result  |
| ---------- | ------- | --------- | ------- | ------------------------- | ------- |
| "34:33"    | "13:00" | "00:55"   | "02:55" | \["next", "prev"]         | "13:00" |
| "10:55"    | "00:05" | "00:15"   | "06:55" | \["prev", "next", "next"] | "06:55" |
| "07:22"    | "04:05" | "00:15"   | "04:07" | \["next"]                 | "04:17" |

## 📌입출력 예 설명

**입출력 예 #1**

* 시작 위치 13분 0초에서 10초 후로 이동하면 13분 10초입니다.
* 13분 10초에서 10초 전으로 이동하면 13분 0초입니다.
* 따라서 "13:00"을 return 하면 됩니다.

**입출력 예 #2**

* 시작 위치 0분 5초에서 10초 전으로 이동합니다. 현재 위치가 10초 미만이기 때문에 0분 0초로 이동합니다.
* 0분 0초에서 10초 후로 이동하면 0분 10초입니다.
* 0분 10초에서 10초 후로 이동하면 0분 20초입니다. 0분 20초는 오프닝 구간이기 때문에 오프닝이 끝나는 위치인 6분 55초로 이동합니다. 따라서 "06:55"를 return 하면 됩니다.

**입출력 예 #3**

* 시작 위치 4분 5초는 오프닝 구간이기 때문에 오프닝이 끝나는 위치인 4분 7초로 이동합니다. 4분 7초에서 10초 후로 이동하면 4분 17초입니다. 따라서 "04:17"을 return 하면 됩니다.

## 📌풀이

1. 문자열 파라미터를 계산 가능한 정수 타입으로 변환. 이때 계산하기 편하게 분-초 변환 메서드 생성 및 사용
2. 시작 시 오프닝 구간인지 체크하여 건너뛰기
3. 조건과 동작에 맞게 `commands` 수행. 각 `command` 수행 시 오프닝 구간인지 체크하여 건너뛰기
4. 초-분 변환 후 리턴. 이때 `commands`가 없는 경우, 각 파라미터 값이 0일 경우 대비하여 수행된 게 없더라도 포맷에 맞게 변환 후 리턴

### 기본 제공 코드

```java
class Solution {
    public String solution(String video_len, String pos, String op_start, String op_end, String[] commands) {
        String answer = "";
        return answer;
    }
}
```

### 제출 코드

```java
class Solution {
    public String solution(String video_len, String pos, String op_start, String op_end, String[] commands) {
        int video_lenBySec = timeToSeconds(video_len);
        int posBySec = timeToSeconds(pos);
        int op_startBySec = timeToSeconds(op_start);
        int op_endBySec = timeToSeconds(op_end);

        posBySec = checkedPos(posBySec, op_startBySec, op_endBySec);

        for(String command : commands) {
            if(command.equals("prev")) {
                posBySec = Math.max(0, posBySec - 10);
            } else {
                posBySec = Math.min(video_lenBySec, posBySec + 10);
            }

            posBySec = checkedPos(posBySec, op_startBySec, op_endBySec);
        }

        return secondsToTime(posBySec);
    }

    private int timeToSeconds(String time) {
        String[] splitTime = time.split(":");
        int min = Integer.parseInt(splitTime[0]);
        int sec = Integer.parseInt(splitTime[1]);

        return min * 60 + sec;
    }

    private String secondsToTime(int seconds) {
        int min = seconds / 60;
        int sec = seconds % 60;

        return String.format("%02d:%02d", min, sec);
    }

    private int checkedPos(int posBySec, int op_startBySec, int op_endBySec) {
        if(posBySec >= op_startBySec && posBySec <= op_endBySec) return op_endBySec;
        else return posBySec;
    }
}
```

***

## 📌회고

분, 초를 각각 다루면서 비교하는 것보다 하나의 단위로 변환하고 계산 후에 결과를 위해 다시 변환하는 게 직관적이고 간편하다.

`lpad` 메서드를 직접 만들 수도 있겠지만, `String.format()`을 활용하는 게 더 낫다고 판단했다.

`commands` 처리 중 현재 재생 위치가 오프닝 구간이면 건너뛰는 건 반복문 안에 두었는데, 시작부터 건너뛰어야 하는 케이스도 있었다.
