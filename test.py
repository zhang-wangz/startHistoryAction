import requests
import json
from typing import Dict, Any, Literal
import os


class StarHistoryClient:
    def __init__(self, base_url: str = "http://localhost:3000"):
        """
        初始化Star History客户端

        Args:
            base_url: Next.js服务的基础URL
        """
        self.base_url = base_url.rstrip('/')
        self.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

    def get_star_history(self, repo: str, token: str = "") -> Dict[str, Any]:
        """
        获取仓库的star历史数据

        Args:
            repo: 仓库名称 (格式: owner/repo)
            token: GitHub Token (可选)

        Returns:
            包含star历史数据的字典
        """
        try:
            # 构建请求URL
            url = f"{self.base_url}/api/star"
            params = {
                'repo': repo,
                'token': token
            }

            # 发送请求
            response = requests.get(url, params=params, headers=self.headers)
            response.raise_for_status()

            return response.json()

        except requests.exceptions.RequestException as e:
            print(f"获取数据失败: {str(e)}")
            if hasattr(e.response, 'json'):
                print(f"错误详情: {e.response.json()}")
            return {}

    def get_chart(self,
                  repo: str,
                  output_path: str,
                  token: str = "",
                  chart_type: Literal["Date", "Timeline"] = "Date",
                  format: Literal["svg", "png"] = "svg") -> bool:
        """
        获取仓库的star历史图表

        Args:
            repo: 仓库名称 (格式: owner/repo)
            output_path: 输出文件路径
            token: GitHub Token (可选)
            chart_type: 图表类型，可选 "Date" 或 "Timeline"
            format: 输出格式，可选 "svg" 或 "png"

        Returns:
            是否成功获取并保存图表
        """
        try:
            # 构建请求URL
            url = f"{self.base_url}/api/chart"
            params = {
                'repo': repo,
                'token': token,
                'type': chart_type,
                'format': format
            }

            # 发送请求
            response = requests.get(url, params=params)
            response.raise_for_status()

            # 根据格式保存文件
            mode = 'wb' if format == 'png' else 'w'
            encoding = None if format == 'png' else 'utf-8'

            with open(output_path, mode, encoding=encoding) as f:
                if format == 'png':
                    f.write(response.content)
                else:
                    f.write(response.text)

            print(f"图表已保存到: {output_path}")
            return True

        except requests.exceptions.RequestException as e:
            print(f"获取图表失败: {str(e)}")
            if hasattr(e.response, 'json'):
                print(f"错误详情: {e.response.json()}")
            return False


def main():
    # 创建客户端实例
    client = StarHistoryClient()

    # 示例仓库
    repo = "zhang-wangz/LeetCodeRating"

    # 可选：GitHub Token（如果有的话）
    github_token = os.getenv("GITHUB_TOKEN", "")

    # 1. 获取star历史数据
    data = client.get_star_history(repo, github_token)
    if data:
        print("\nStar历史数据:")
        print(json.dumps(data, indent=2, ensure_ascii=False))

    # 3. 获取并保存PNG图表
    client.get_chart(repo, "star_history.png", github_token, format="png")

if __name__ == "__main__":
    main()