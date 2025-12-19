---
publish: true
title: 나만의 리눅스 터미널 설정
description: 유용한 터미널 설정을 알아보자
author: Nine
date: 2025-02-15 10:00:00
categories:
  - WSL
  - Terminal
tags:
  - devlog
  - linux
  - terminal
  - 리눅스
  - 터미널
# image: Status: Done
---
## 📌개요

나만의 리눅스 터미널을 설정한다.

## 📌내용

### 사전 준비

`WSL`, `Windows Terminal` 설치 등은 제외하고 Linux 환경에서 정리 시작
설치에 필요한 `wget`, `curl`, `git`을 설치한다.

```bash
sudo apt-get update
sudo apt install wget curl git
```

`zsh`를 설치한다.

```bash
sudo apt install zsh
```

현재 유저의 기본 쉘을 변경한다.

```bash
chsh -s $(which zsh)
```

설정을 확인한다.

```bash
echo $SHELL
# /usr/bin/zsh
```

### oh-my-zsh

#### 설치

[oh-my-zsh 설치](https://ohmyz.sh/#install)

##### Install oh-my-zsh via curl

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

##### Install oh-my-zsh via wget


```bash
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

#### 설정

폰트는 `fonts-powerline​`등 `agnoster` 테마를 정상적으로 사용할 수 있는 폰트로 사용한다.

##### 테마 설정

```bash
# vim 에디터로 .zshrc 열기
vim ~/.zshrc
# .zshrc 중 ZSH_THEME 부분
ZSH_THEME="agnoster"
# 수정 후 저장
# 이후 적용
source ~/.zshrc
```

##### 플러그인 사용 설정

아래 설치한 플러그인을 사용하기 위해선 `.zshrc` 파일에 설정해야 한다.

```bash
# vim 에디터로 .zshrc 열기
vim ~/.zshrc
# .zshrc 중 plugins 부분
plugins=(  
	...
	zsh-syntax-highlighting
	zsh-autosuggestions
	fzf
	...  
)
# 수정 후 저장
# 이후 적용
source ~/.zshrc
```

##### zsh-syntax-highlighting

명령어 문법에 따른 강조 표시하는 플러그인

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

##### zsh-autosuggestions

명령어에 대한 자동완성을 돕는 플러그인
이전 사용했던 명령어 또는 사용할 수 있는 명령어 등을 제안해준다.

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

##### fzf (Fuzzy Finder )

파일 찾기, 명령어 히스토리 등 터미널을 강력하게 사용할 수 있다.

[fzf 자세히 보기](https://github.com/junegunn/fzf)

```bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install​
# Do you want to enable fuzzy auto-completion? ([y]/n) y
# Do you want to enable key bindings? ([y]/n) y
# Do you want to update your shell configuration files? ([y]/n) y
# Update /home/nine/.bashrc:
#   - [ -f ~/.fzf.bash ] && source ~/.fzf.bash
#     + Added
# 
# Update /home/nine/.zshrc:
#   - [ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
#     + Added
# 
# Finished. Restart your shell or reload config file.
#    source ~/.bashrc  # bash
#    source ~/.zshrc   # zsh
# 
# Use uninstall script to remove fzf.
# 
# For more information, see: https://github.com/junegunn/fzf
```

##### 커스텀 설정

- 사용자명 + 랜덤 이모지 설정

```bash
# vim 에디터로 .zshrc 열기
vim ~/.zshrc
# .zshrc 최하단에 추가
prompt_context() {
  # Custom (Random emoji)
  emojis=("🦋" "🌈")
  RAND_EMOJI_N=$(( $RANDOM % ${#emojis[@]} + 1))
  prompt_segment black default "Name ${emojis[$RAND_EMOJI_N]} "
}
# 수정 후 저장
# 이후 적용
source ~/.zshrc
```

- 새로운 줄에서 명령어 시작
	- 경로가 길거나 명령어가 길거나 뭐, 가끔 테마가 깨지는 경우를 대비해 깔끔하게 새로운 라인에서 명령어를 입력할 수 있게 변경

```bash
# 테마의 환경 파일 열기
vim ~/.oh-my-zsh/themes/agnoster.zsh-theme
# build_prompt 부분을 찾아서 prompt_hg와 prompt_end 사이에 prompt_newline을 추가
build_prompt() {
	RETVAL=$?
	prompt_status
	prompt_virtualenv
	prompt_aws
	prompt_context
	prompt_dir
	prompt_git
	prompt_bzr
	prompt_hg
	prompt_newline # 이 위치에 추가한다.
	prompt_end
}
# 아래 내용을 추가한다.
prompt_newline() {
  if [[ -n $CURRENT_BG ]]; then
    echo -n "%{%k%F{$CURRENT_BG}%}$SEGMENT_SEPARATOR
%{%k%F{blue}%}$SEGMENT_SEPARATOR"
  else
    echo -n "%{%k%}"
  fi

  echo -n "%{%f%}"
  CURRENT_BG=''
}
# 수정 후 저장
# 이후 적용
source ~/.zshrc
```

### Tmux

터미널 세션을 만들 수 있고 터미널 분할이 가능하다.
세션을 바꿔가며 터미널을 확인할 수 있다.

`tmux` 명령으로 실행할 때마다 새로운 세션이 생성된다.

```bash
# tmux 설치
sudo apt-get install tmux
# 이후 tmux 실행
tmux
```

이후 `tmux`의 설정(`.tmux.conf`)은 세션을 재시작하거나 명령어로 적용할 수 있다.

```bash
# prefix + b, :
# 명령 모드에서
source-file ~/.tmux.conf
```

#### Tmux Command

|명령어|설명|
|---|---|
|`tmux`|새 tmux 세션 시작|
|`tmux ls` 또는 `tmux list-sessions`|실행 중인 tmux 세션 목록 보기|
|`tmux attach-session -t {세션명}`|특정 세션에 접근 (세션명에 따라)|
|`tmux attach` 또는 `tmux a`|마지막으로 사용한 tmux 세션에 접근|
|`tmux new -s {세션명}`|새로운 tmux 세션을 특정 이름으로 시작|
|`tmux kill-session -t {세션명}`|특정 세션 종료 (세션명에 따라)|
|`tmux kill-server`|모든 tmux 세션 종료 (서버 종료)|
|`Ctrl + b, d`|현재 tmux 세션에서 detach (세션 분리)|
|`Ctrl + b, s`|세션 목록 보기 (세션 선택 후 attach 가능)|
|`Ctrl + b, $`|현재 세션의 이름 변경 (rename session)|

#### Tmux Shortcuts

- Meta 키 `M` - 일반적으로 `Alt` 키로 매핑된다. 즉, `M-1`은 `Alt + 1` 과 동일하다.
- `DC`는 `delete` 키를 의미한다.

| 단축키                              | 설명                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `C-b C-b`                        | Prefix 키 자체를 입력 (즉, `C-b`를 두 번 입력)                                                         |
| `Prefix C-o`                     | 창을 순환 이동 (Rotate through panes)                                                            |
| `Prefix C-z`                     | 현재 클라이언트 일시 정지 (Suspend the current client)                                                |
| `Prefix Space`                   | 다음 레이아웃 선택 (Select next layout)                                                            |
| `Prefix !`                       | 현재 패널을 새로운 창으로 이동 (Break pane to a new window)                                             |
| `Prefix "`                       | 창을 수직으로 분할 (Split window vertically)                                                       |
| `Prefix #`                       | 모든 붙여넣기 버퍼 목록 표시 (List all paste buffers)                                                  |
| `Prefix $`                       | 현재 세션 이름 변경 (Rename current session)                                                       |
| `Prefix %`                       | 창을 수평으로 분할 (Split window horizontally)                                                     |
| `Prefix &`                       | 현재 창 종료 (Kill current window)                                                              |
| `Prefix '`                       | 창 번호 입력 후 이동 (Prompt for window index to select)                                           |
| `Prefix (`                       | 이전 클라이언트로 전환 (Switch to previous client)                                                   |
| `Prefix )`                       | 다음 클라이언트로 전환 (Switch to next client)                                                       |
| `Prefix ,`                       | 현재 창 이름 변경 (Rename current window)                                                         |
| `Prefix -`                       | 가장 최근 붙여넣기 버퍼 삭제 (Delete the most recent paste buffer)                                     |
| `Prefix .`                       | 현재 창 이동 (Move the current window)                                                          |
| `Prefix /`                       | 키 바인딩 설명 표시 (Describe key binding)                                                         |
| `Prefix 0~9`                     | 특정 번호의 창 선택 (Select window 0~9)                                                            |
| `Prefix :`                       | 명령어 입력 프롬프트 (Prompt for a command)                                                         |
| `Prefix ;`                       | 이전 활성 패널로 이동 (Move to the previously active pane)                                          |
| `Prefix =`                       | 붙여넣기 버퍼 선택 (Choose a paste buffer from a list)                                             |
| `Prefix ?`                       | 키 바인딩 목록 표시 (List key bindings)                                                            |
| `Prefix C`                       | 옵션 사용자 지정 (Customize options)                                                              |
| `Prefix D`                       | 클라이언트 분리 선택 (Choose and detach a client from a list)                                       |
| `Prefix E`                       | 패널 크기를 균등하게 조정 (Spread panes out evenly)                                                   |
| `Prefix L`                       | 마지막 클라이언트로 전환 (Switch to the last client)                                                  |
| `Prefix M`                       | 선택된 패널 마크 해제 (Clear the marked pane)                                                       |
| `Prefix [`                       | 복사 모드 진입 (Enter copy mode) -> spacebar 선택, enter 복사 (키가 동작하지 않는 경우 vi 키맵핑 필요할 수 있음)        |
| `Prefix ]`                       | 최근 붙여넣기 버퍼 붙여넣기 (Paste the most recent paste buffer)                                       |
| `Prefix c`                       | 새 창 생성 (Create a new window)                                                               |
| `Prefix d`                       | 현재 클라이언트 분리 (Detach the current client)                                                    |
| `Prefix f`                       | 패널 검색 (Search for a pane)                                                                  |
| `Prefix i`                       | 창 정보 표시 (Display window information)                                                       |
| `Prefix l`                       | 이전 창으로 이동 (Select the previously current window)                                           |
| `Prefix m`                       | 현재 패널 마크/마크 해제 (Toggle the marked pane)                                                    |
| `Prefix n`                       | 다음 창 선택 (Select the next window)                                                           |
| `Prefix o`                       | 다음 패널 선택 (Select the next pane)                                                            |
| `Prefix p`                       | 이전 창 선택 (Select the previous window)                                                       |
| `Prefix q`                       | 패널 번호 표시 (Display pane numbers)                                                            |
| `Prefix r`                       | 현재 클라이언트 다시 그리기 (Redraw the current client)                                                |
| `Prefix s`                       | 세션 목록에서 선택 (Choose a session from a list)                                                  |
| `Prefix t`                       | 시계 표시 (Show a clock)                                                                       |
| `Prefix w`                       | 창 목록에서 선택 (Choose a window from a list)                                                    |
| `Prefix x`                       | 활성 패널 종료 (Kill the active pane)                                                            |
| `Prefix z`                       | 패널 확대/축소 (Zoom the active pane)                                                            |
| `Prefix {`                       | 현재 패널을 위쪽 패널과 교환 (Swap the active pane with the pane above)                                |
| `Prefix }`                       | 현재 패널을 아래쪽 패널과 교환 (Swap the active pane with the pane below)                               |
| `Prefix ~`                       | 메시지 기록 보기 (Show messages)                                                                  |
| `Prefix DC` (`DC` = `delete`)    | 창의 보이는 부분을 커서가 따라가도록 리셋 (Reset visible part of the window follows the cursor)              |
| `Prefix PPage`                   | 복사 모드에서 위로 스크롤 (Enter copy mode and scroll up)                                             |
| `Prefix ↑ / ↓ / ← / →`           | 패널 간 이동 (Select pane up/down/left/right)                                                   |
| `Prefix M-1 ~ M-5` (`M` = `Alt`) | 레이아웃 설정 (Set even-horizontal, even-vertical, main-horizontal, main-vertical, tiled layout) |
| `Prefix M-n / M-p`               | 경고가 있는 창으로 이동 (Select next/previous window with an alert)                                  |
| `Prefix M-o`                     | 패널을 반대 방향으로 순환 (Rotate through the panes in reverse)                                       |
| `Prefix M-↑ / M-↓ / M-← / M-→`   | 패널 크기 조정 (Resize pane up/down/left/right by 5)                                             |
| `Prefix C-↑ / C-↓ / C-← / C-→`   | 패널 크기 조정 (Resize pane up/down/left/right)                                                  |
| `Prefix S-↑ / S-↓ / S-← / S-→`   | 창의 보이는 부분을 이동 (Move the visible part of the window up/down/left/right)                     |

#### Tmux Plugin Manager

Tmux Plugin Manager (`TPM`) 설치

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# 사용자의 홈 디렉토리에 `.tmux.conf` 파일을 열거나 생성한다.
vim ~/.tmux.conf

# 아래 내용을 입력 후 저장

# TPM 설정
set -g @plugin 'tmux-plugins/tpm'
# tmux에서 마우스 스크롤 활성화
set -g mouse on
# TPM을 초기화하는 설정
run '~/.tmux/plugins/tpm/tpm'
```

`TPM`이 설정되었으면 `tmux`에서 다음 명령을 입력하여 플러그인을 설치할 수 있다.

```bash
# tmux에서 새로운 세션을 시작하고 (또는 기존 세션에서)
prefix + I
```

#### Tmux Resurrect

[Tmux Resurrect 자세히 보기](https://github.com/tmux-plugins/tmux-resurrect)

시스템 리부팅 시 작업하던 Tmux 세션이 날아가는데,
세션을 저장하고 불러올 수 있게 해준다.

##### 플러그인 설정 및 설치

```bash
# 사용자의 홈 디렉토리에 `.tmux.conf` 파일을 생성하거나 수정
vim ~/.tmux.conf

# 아래 내용을 run '~/.tmux/plugins/tpm/tpm' 명령 위에 추가 후 저장

# tmux-resurrect 플러그인 추가
set -g @plugin 'tmux-plugins/tmux-resurrect'

# 만약 TPM 설치도 정상, .tmux.conf 설정도 정상일 때 결과
# [0/0]Installing "tmux-resurrect"
# "tmux-resurrect" download success
#
# TMUX environment reloaded.
#
# Done, press ESCAPE to continue.
```

##### Key bindings

- `prefix + Ctrl-s` - save
- `prefix + Ctrl-r` - restore

#### vi 키 맵핑

tmux는 기본적으로 vi 키로 동작하지만 정상적으로 키 입력이 안 되는 경우가 발생할 수 있다.
그럴 땐 직접 vi 키 맵핑으로 동작할 수 있게 설정에 추가하고 적용한다.

문서 하단에 추가하고 설정 적용 커맨드 실행한다.

```bash
# 사용자의 홈 디렉토리에 `.tmux.conf` 파일을 생성하거나 수정
vim ~/.tmux.conf

# vi 키 바인딩
# 복사모드 Termux에서 실행 중인 tmux 세션에서 스페이스바와 Enter 키를 사용하여 해당 줄을 복사
set-window-option -g mode-keys vi
```

## 📌선택사항

### Windows Terminal 설치

`MicroSoft Store`에서 `Windows Terminal`을 설치한다.
터미널의 설정에서 기본 프로필, 폰트, 컬러 등을 설정한다.

### WSL 설치

명령어로 설치 가능하지만, 더 자세한 자료 확인이 필요하다면
[WSL을 사용하여 Windows에 Linux를 설치하는 방법](https://learn.microsoft.com/ko-kr/windows/wsl/install)

```bash
wsl --install
```

### WSL 삭제

#### 1.설치 상태 확인

`WSL`에서 설치된 `Linux` 배포판 목록과 해당 배포판의 상태를 확인한다.

```bash
wsl -l -v

#    NAME              STATE           VERSION
#  * Ubuntu            Stopped         2
```

#### 2.등록 해제

`NAME`으로 등록 해제한다.

```bash
wsl --unregister Ubuntu

# 등록 취소 중입니다.
# 작업을 완료했습니다.
```

#### 3.Ubuntu 제거

`Windows`의 시작 메뉴에서 `ubuntu`를 찾아 제거한다.

#### 4.선택 사항

필요하다면 아래 절차도 진행한다.
버전이 바뀌면서 다를 수 있으니 케이스에 맞지 않다면 넘어간다.

- `앱 > 설치된 앱`에서 `Windows Subsystem for Linux`, `Linux용 Windows 하위 시스템` 삭제
- `Win + R` 눌러 실행을 열고, `optionalfeatures`를 입력해서 `Windows 기능 창`을 연다.
	- `Linux용 Windows 하위 시스템`을 체크 해제하고 재부팅
- WSL의 파일은 기본적으로 `C:\Users\{사용자 이름}\AppData\Local\Packages` 폴더에 저장된다.
	- 이 폴더에서 해당 배포판 관련 폴더를 찾아 삭제할 수 있다.

### Powerlevel10k

>[!TIP] powerlevel10k repository
>[GitHub-powerlevel10k](https://github.com/romkatv/powerlevel10k#oh-my-zsh)
>[심볼 표현을 위한 meslo font](https://github.com/romkatv/powerlevel10k#meslo-nerd-font-patched-for-powerlevel10k)

저장소를 클론 받는다.
폰트도 미리 설치하면 편하다.

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

`.zshrc`를 열어서 테마를 변경한다.

```bash
vim ~/.zshrc
# ZSH_THEME 찾아서 변경
ZSH_THEME="powerlevel10k/powerlevel10k"
# 변경된 .zshrc 적용
source ~/.zshrc
```

변경된 `.zshrc` 적용 후 아래와 같이 출력 되면 성공

- UTF-8 텍스트 확인
    - `ASCII` 문자로 충분했지만 대부분의 오픈 소스들은 거의 최소 `UTF-8`를 쓰고 있기 때문에 사용하는 폰트가 해당 텍스트를 지원하고 있는지 확인하는 것
- PUA(Private Use Area)에 해당하는 글자가 보이는지 확인
    - PUA는 이름 그대로 사용자 정의 영역이고 `UTF-8`, `UTF-16`에서 사용자 개인이 직접 특수 문자를 정의해서 쓸 수 있는 구간.(`U+E000 ~ U+F8FF`, `U+F0000 ~ U+10FFFF`)
```bash
This is Powerlevel10k configuration wizard. You are seeing it because you haven't
      defined any Powerlevel10k configuration options. It will ask you a few questions and
                                     configure your prompt.
    
                        Does this look like a diamond (rotated square)?
                          reference: https://graphemica.com/%E2%97%86
    
                                         --->    <---
    
    (y)  Yes.
    
    (n)  No.
    
    (q)  Quit and do nothing.
    
    Choice [ynq]:
```

이후 여러가지 설정을 묻는데 취향에 맞게 설정 후 `recommended` 옵션으로 마무리한다.
기존에 적용했던 랜덤 임티와 이름 표현도 수정이 필요하다.

- 테마 재설정
    ```bash
    p10k configure
    ```

#### `~/.p10k.zsh`

- 랜덤 이모지 적용

```bash
  # The list of segments shown on the left. Fill it with the most important segments.
  typeset -g POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(
    # =========================[ Line #1 ]=========================
    # os_icon               # os identifier
    custom_emoji            # custom emoji
    dir                     # current directory
    vcs                     # git status
    # =========================[ Line #2 ]=========================
    newline                 # \n
    # prompt_char           # prompt symbol
  )
  # custom emoji env
  POWERLEVEL9K_CUSTOM_EMOJI="my_random_emoji"
  POWERLEVEL9K_CUSTOM_EMOJI_BACKGROUND=0   # 배경
  # custom emoji function
  function my_random_emoji() {
    local emojis=("🤌")
    echo "${emojis[RANDOM % ${#emojis[@]} + 1]}"
  }
```

- 경로 축약 표현
    - 취향에 맞게 적절히 조정

```bash
  # If directory is too long, shorten some of its segments to the shortest possible unique
  # prefix. The shortened directory can be tab-completed to the original.
  # typeset -g POWERLEVEL9K_SHORTEN_STRATEGY=truncate_to_unique
  typeset -g POWERLEVEL9K_SHORTEN_STRATEGY=truncate
  # Replace removed segment suffixes with this symbol.
  # typeset -g POWERLEVEL9K_SHORTEN_DELIMITER=
  typeset -g POWERLEVEL9K_SHORTEN_DELIMITER=...

  # If set to "first" ("last"), remove everything before the first (last) subdirectory that contains
  # files matching $POWERLEVEL9K_SHORTEN_FOLDER_MARKER. For example, when the current directory is
  # /foo/bar/git_repo/nested_git_repo/baz, prompt will display git_repo/nested_git_repo/baz (first)
  # or nested_git_repo/baz (last). This assumes that git_repo and nested_git_repo contain markers
  # and other directories don't.
  #
  # Optionally, "first" and "last" can be followed by ":<offset>" where <offset> is an integer.
  # This moves the truncation point to the right (positive offset) or to the left (negative offset)
  # relative to the marker. Plain "first" and "last" are equivalent to "first:0" and "last:0"
  # respectively.
  typeset -g POWERLEVEL9K_DIR_TRUNCATE_BEFORE_MARKER=false
  # Don't shorten this many last directory segments. They are anchors.
  typeset -g POWERLEVEL9K_SHORTEN_DIR_LENGTH=1
  # Shorten directory if it's longer than this even if there is space for it. The value can
  # be either absolute (e.g., '80') or a percentage of terminal width (e.g, '50%'). If empty,
  # directory will be shortened only when prompt doesn't fit or when other parameters demand it
  # (see POWERLEVEL9K_DIR_MIN_COMMAND_COLUMNS and POWERLEVEL9K_DIR_MIN_COMMAND_COLUMNS_PCT below).
  # If set to `0`, directory will always be shortened to its minimum length.
  typeset -g POWERLEVEL9K_DIR_MAX_LENGTH=80
  # When `dir` segment is on the last prompt line, try to shorten it enough to leave at least this
  # many columns for typing commands.
  typeset -g POWERLEVEL9K_DIR_MIN_COMMAND_COLUMNS=40
  # When `dir` segment is on the last prompt line, try to shorten it enough to leave at least
  # COLUMNS * POWERLEVEL9K_DIR_MIN_COMMAND_COLUMNS_PCT * 0.01 columns for typing commands.
  typeset -g POWERLEVEL9K_DIR_MIN_COMMAND_COLUMNS_PCT=50
  # If set to true, embed a hyperlink into the directory. Useful for quickly
  # opening a directory in the file manager simply by clicking the link.
  # Can also be handy when the directory is shortened, as it allows you to see
  # the full directory that was used in previous commands.
  typeset -g POWERLEVEL9K_DIR_HYPERLINK=false
```

## ⚙️EndNote

### WSL

Windows Sub-system for Linux, 윈도우의 하위 시스템으로 리눅스 사용

>[!info]
>개발자는 Windows 컴퓨터에서 동시에 Windows와 Linux의 기능에 액세스할 수 있습니다. WSL(Linux용 Windows 하위 시스템)을 사용하면 개발자가 Linux 배포판(예: Ubuntu, OpenSUSE, Kali, Debian, Arch Linux)을 설치하고 기존 가상 머신 또는 이중 부팅 설정의 오버헤드 없이 Windows에서 직접 Linux 애플리케이션, 유틸리티 및 Bash 명령줄 도구를 사용할 수 있습니다.

#### Git 자격증명 관련

WSL을 사용할 때 `git` 명령어 사용 시 username, password를 요구하는 경우가 있다.
온전한 `linux`가 아니라서 별도 라이브러리를 사용해야 할 수도 있다.
일단, 간단한 방법으로는 `windows`의 자격증명을 사용하게끔 설정하는 방법이다.
`git`이 설치되어 있어야 한다.

```bash
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe"
```

#### git status

WSL을 사용할 때 `git status` 확인 시 다른 프로필의 터미널로 확인할 때와 다른 경우가 있다.

1. CRLF(Line Ending) 차이
2. Git이 파일 권한(Executable Bit)을 다르게 인식
	1. WSL에서는 파일의 실행 권한(`chmod +x`)이 적용되지만, Windows에서는 실행 권한 개념이 없기 때문에 파일이 변경된 것처럼 인식될 수 있다.
3. 저장소를 클론 받은 주체에 따라 접근 권한에 대한 오류가 발생할 수도 있다.

따라서 모든 케이스를 해결할 필요는 없고 적절한 조치를 취하면 된다.
해결 가능한 요약 정보만 정리한다.

```bash
# 줄바꿈 문제
git config --global core.autocrlf false
# 파일 권한 변경 감지 방지
git config --global core.fileMode false
# 대소문자 문제 방지
git config --global core.ignoreCase false
# 심볼릭 링크 문제 해결
git config --global core.symlinks true
```