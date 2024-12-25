import os
import pyperclip


def get_dirs_with_depth(path='.', prefix='', max_depth=3, current_depth=0):
    result = []
    dirs = [d for d in os.listdir(path) if os.path.isdir(
        os.path.join(path, d)) and not d.startswith('.')]
    dirs.sort()

    for i, dir_name in enumerate(dirs):
        is_last = i == len(dirs) - 1
        result.append(f"{prefix}{'└── ' if is_last else '├── '}{dir_name}")

        if current_depth < max_depth:
            next_prefix = prefix + ('    ' if is_last else '│   ')
            result.extend(get_dirs_with_depth(
                os.path.join(path, dir_name),
                next_prefix,
                max_depth,
                current_depth + 1
            ))

    return result


# 生成目錄結構並複製到剪貼簿
directory_tree = '\n'.join(get_dirs_with_depth(max_depth=2))
pyperclip.copy(directory_tree)
print("目錄結構已複製到剪貼簿!")
