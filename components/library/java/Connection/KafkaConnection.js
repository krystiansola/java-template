/*
* (c) Copyright IBM Corporation 2021
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

export function Connection() {
  return `
public class Connection {
    public String BOOTSTRAP_ADDRESS;
    public String APP_USER;
    public String APP_PASSWORD;

    public Connection(String BOOTSTRAP_ADDRESS,
                        String APP_USER, String APP_PASSWORD) {
        this.BOOTSTRAP_ADDRESS = BOOTSTRAP_ADDRESS;
        this.APP_USER = APP_USER;
        this.APP_PASSWORD = APP_PASSWORD;
    }
}
`;
}
